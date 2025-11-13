import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, Button, Text } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@/app/modules/common/api/socket';
import * as SecureStore from 'expo-secure-store';
import { useChatMutation } from '@/app/modules/chat/api/hooks';
import { useUser } from '@/app/modules/user/api/hooks';

export default function ChatRoomScreen({ route }) {
  const { contactId, contactName } = route.params;
  const user = useUser();
  const [chatId, setChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const queryClient = useQueryClient();
  const { mutate } = useChatMutation();

  const socket = getSocket(user.data.id);

  useEffect(() => {
    mutate(contactId, {
      onSuccess: (data) => {
        if (data?.chatId) setChatId(data.chatId);
        else console.warn('No chatId in response', data);
      },
      onError: (err) => console.error('Chat creation failed', err),
    });
  }, [contactId]);

  useEffect(() => {
    if (!chatId) return;

    if (!socket.connected) socket.connect();

    socket.emit('joinChat', { chatId });

    const handleMessage = (msg) => {
      if (msg.chatId === chatId) {
        setMessages(prev => {
          if (prev.some(m => m.createdAt === msg.createdAt && m.senderId === msg.senderId)) return prev;
          const updated = [...prev, msg];
          SecureStore.setItemAsync(`chat_${chatId}`, JSON.stringify(updated));
          updateChatsList(msg);
          return updated;
        });
      }
    };

    const handleHistory = ({ chatId: id, messages }) => {
      if (id === chatId) {
        setMessages(prev => {
          const merged = [...prev];
          for (const msg of messages) {
            if (!merged.some(m => m.createdAt === msg.createdAt && m.senderId === msg.senderId)) {
              merged.push(msg);
            }
          }
          return merged;
        });
      }
    };

    socket.on('message', handleMessage);
    socket.on('messageHistory', handleHistory);

    return () => {
      socket.off('message', handleMessage);
      socket.off('messageHistory', handleHistory);
      socket.emit('leaveChat', { chatId });
    };
  }, [chatId]);

  useEffect(() => {
    const handleNotification = (msg) => {
      console.log('Нове повідомлення для користувача', msg);
    };
    socket.on('newMessageNotification', handleNotification);

    return () => {
      socket.off('newMessageNotification', handleNotification);
    };
  }, []);

  const updateChatsList = async (msg) => {
    const raw = await SecureStore.getItemAsync('chatsList');
    const chats = raw ? JSON.parse(raw) : [];
    const index = chats.findIndex(c => c.chatId === chatId);
    const entry = { chatId, contactId, contactName, lastMessage: msg.text, updatedAt: Date.now() };
    if (index >= 0) chats[index] = entry;
    else chats.push(entry);
    await SecureStore.setItemAsync('chatsList', JSON.stringify(chats));
    queryClient.setQueryData(['chats'], chats);
  };

  const send = () => {
    if (!text.trim() || !chatId) return;
    const msg = { chatId, senderId: user.data.id, text, createdAt: new Date().toISOString() };
    socket.emit('sendMessage', msg);

    setMessages(prev => {
      const exists = prev.find(m => m.createdAt === msg.createdAt && m.senderId === msg.senderId);
      if (exists) return prev;
      updateChatsList(msg);
      return [...prev, msg];
    });

    setText('');
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Text
            style={{
            alignSelf: item.senderId === user.data.id ? 'flex-end' : 'flex-start',
            backgroundColor: item.senderId === user.data.id ? '#DCF8C6' : '#ECECEC',
            marginVertical: 2,
            padding: 8,
            borderRadius: 8,
          }}>
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