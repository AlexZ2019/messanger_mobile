import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, TextInput, View, StyleSheet } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@/app/modules/common/api/socket';
import { useChatMutation } from '@/app/modules/chat/api/hooks';
import { useUser } from '@/app/modules/user/api/hooks';
import uuid from 'react-native-uuid';
import {
  Chat,
  ChatRoomScreenNavigationProp,
  ChatRoomScreenRouteProp,
  Message,
} from '@/app/modules/chat/types';
import { getChatsList, loadMessages, saveChatsList, saveMessages } from '@/app/modules/chat/utils/storageApI';

type Props = {
  route: ChatRoomScreenRouteProp;
  navigation: ChatRoomScreenNavigationProp;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  message: {
    marginVertical: 2,
    padding: 8,
    borderRadius: 8,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
});

export default function ChatRoomScreen({ route }: Props) {
  const { contactId, localName } = route.params;
  const user = useUser();
  const userId = user?.data?.id;
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');

  const queryClient = useQueryClient();
  const { mutate } = useChatMutation();
  const socket = getSocket(userId);

  const upsertChat = async (chatId: string, lastMessage?: string) => {
    const chats: Chat[] = await getChatsList();
    const index = chats.findIndex(c => c.chatId === chatId);
    const entry = {
      chatId,
      contactId,
      localName,
      lastMessage: lastMessage || '',
      updatedAt: Date.now(),
    };

    if (index >= 0) chats[index] = entry;
    else chats.push(entry);

    await saveChatsList(chats);
    queryClient.setQueryData(['chats'], chats);
  };

  useEffect(() => {
    mutate(contactId, {
      onSuccess: async data => {
        setChatId(data.chatId);
        await upsertChat(data.chatId);
      },
      onError: err => console.error('Chat creation failed', err),
    });
  }, [contactId]);

  useEffect(() => {
    if (!chatId) return;
    loadMessages(chatId).then(setMessages);
  }, [chatId]);

  const appendMessage = async (msg: Message) => {
    setMessages(prev => {
      if (prev.some(m => m.createdAt === msg.createdAt && m.senderId === msg.senderId)) return prev;
      const updated = [...prev, msg];

      saveMessages(`chat_${chatId}`, updated);
      upsertChat(msg.chatId, msg.text);

      return updated;
    });
  };

  const handleMessage = (msg: Message) => {
    if (msg.chatId !== chatId) return;
    appendMessage(msg);
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

      saveMessages(`chat_${chatId}`, merged);
      return merged;
    });
  };

  const setupSocketEvents = () => {
    socket.on('message', handleMessage);
    socket.on('messageHistory', handleHistory);

    return () => {
      socket.off('message', handleMessage);
      socket.off('messageHistory', handleHistory);
    };
  };

  useEffect(() => {
    if (!chatId) return;

    if (!socket.connected) socket.connect();
    socket.emit('joinChat', { chatId });

    const cleanup = setupSocketEvents();

    return () => {
      cleanup();
      socket.emit('leaveChat', { chatId });
    };
  }, [chatId]);

  const send = () => {
    if (!text.trim() || !chatId) return;

    const msg = {
      id: uuid.v4() as string,
      chatId,
      senderId: userId!,
      receiverId: contactId,
      text,
      createdAt: new Date().toISOString(),
    };

    socket.emit('sendMessage', msg);
    appendMessage(msg);
    setText('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id || item.createdAt}
        renderItem={({ item }) => (
          <Text
            style={[
              styles.message,
              item.senderId === userId ? styles.myMessage : styles.otherMessage,
            ]}
          >
            {item.text}
          </Text>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
        />
        <Button title="Send" onPress={send} />
      </View>
    </View>
  );
}
