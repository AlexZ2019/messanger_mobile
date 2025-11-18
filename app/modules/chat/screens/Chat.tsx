import React, {useEffect, useState} from 'react';
import {Button, FlatList, Text, TextInput, View} from 'react-native';
import {useQueryClient} from '@tanstack/react-query';
import {getSocket} from '@/app/modules/common/api/socket';
import * as SecureStore from 'expo-secure-store';
import {useChatMutation} from '@/app/modules/chat/api/hooks';
import {useUser} from '@/app/modules/user/api/hooks';
import uuid from "react-native-uuid";
import {Chat, ChatRoomScreenNavigationProp, ChatRoomScreenRouteProp, Message} from "@/app/modules/chat/types";

type Props = {
  route: ChatRoomScreenRouteProp;
  navigation: ChatRoomScreenNavigationProp;
};

export default function ChatRoomScreen({ route }: Props) {
  const { contactId, localName } = route.params;
  const user = useUser();
  const userId = user?.data?.id;
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[] | []>([]);
  const [text, setText] = useState('');

  const queryClient = useQueryClient();
  const { mutate } = useChatMutation();
  const socket = getSocket(userId);

  useEffect(() => {
    mutate(contactId, {
      onSuccess: async (data) => {
        const raw = await SecureStore.getItemAsync('chatsList');
        const chats = raw ? JSON.parse(raw) : [];

        if (!chats.find((c: any) => c.chatId === data.chatId)) {
          chats.push({
            chatId: data.chatId,
            contactId,
            contactName: localName,
            lastMessage: '',
            updatedAt: Date.now(),
          });
          await SecureStore.setItemAsync('chatsList', JSON.stringify(chats));
        }

        queryClient.setQueryData(['chats'], chats);
        setChatId(data.chatId);
      },
      onError: (err) => console.error('Chat creation failed', err),
    });
  }, [contactId]);

  useEffect(() => {
    if (!chatId) return;

    (async () => {
      const raw = await SecureStore.getItemAsync(`chat_${chatId}`);
      // await SecureStore.deleteItemAsync(`chat_${chatId}`)

      if (raw) {
        setMessages(JSON.parse(raw));
      }
    })();
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;

    if (!socket.connected) socket.connect();
    socket.emit('joinChat', { chatId });

    const handleMessage = (msg: Message) => {
      if (msg.chatId !== chatId) return;

      setMessages(prev => {
        if (prev.some(m => m.createdAt === msg.createdAt && m.senderId === msg.senderId)) return prev;

        const updated = [...prev, msg];
        SecureStore.setItemAsync(`chat_${chatId}`, JSON.stringify(updated));
        updateChatsList(msg);
        return updated;
      });
    };

    const handleHistory = ({ chatId: id, messages }: { chatId: string; messages: Message[] }) => {
      if (id !== chatId) return;

      setMessages(prev => {
        const merged = [...prev];
        for (const msg of messages) {
          if (!merged.some(m => m.createdAt === msg.createdAt && m.senderId === msg.senderId)) {
            merged.push(msg);
          }
        }

        SecureStore.setItemAsync(`chat_${chatId}`, JSON.stringify(merged));
        return merged;
      });
    };

    socket.on('message', handleMessage);
    socket.on('messageHistory', handleHistory);

    return () => {
      socket.off('message', handleMessage);
      socket.off('messageHistory', handleHistory);
      socket.emit('leaveChat', { chatId });
    };
  }, [chatId]);

  const updateChatsList = async (msg: Message) => {
    const raw = await SecureStore.getItemAsync('chatsList');
    const chats: Chat[] = raw ? JSON.parse(raw) : [];

    const index = chats.findIndex(c => c.chatId === chatId);
    const entry = {
      chatId: chatId!,
      contactId,
      localName,
      lastMessage: msg.text,
      updatedAt: Date.now(),
    };

    if (index >= 0) chats[index] = entry;
    else chats.push(entry);

    await SecureStore.setItemAsync('chatsList', JSON.stringify(chats));
    queryClient.setQueryData(['chats'], chats);
  };

  const send = () => {
    if (!text.trim() || !chatId) return;

    const msg = {
      id: uuid.v4(),
      chatId,
      senderId: userId!,
      receiverId: contactId,
      text,
      createdAt: new Date().toISOString(),
    };

    socket.emit('sendMessage', msg);

    setMessages(prev => {
      const exists = prev.find(m => m.createdAt === msg.createdAt && m.senderId === msg.senderId);
      if (exists) return prev;

      const updated = [...prev, msg];
      SecureStore.setItemAsync(`chat_${chatId}`, JSON.stringify(updated));
      updateChatsList(msg);
      return updated;
    });

    setText('');
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <Text
            style={{
              alignSelf: item.senderId === userId ? 'flex-end' : 'flex-start',
              backgroundColor: item.senderId === userId ? '#DCF8C6' : '#ECECEC',
              marginVertical: 2,
              padding: 8,
              borderRadius: 8,
            }}
          >
            {item.text}
          </Text>
        )}
      />

      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderRadius: 8, padding: 8 }}
          value={text}
          onChangeText={setText}
        />
        <Button title="Send" onPress={send} />
      </View>
    </View>
  );
}
