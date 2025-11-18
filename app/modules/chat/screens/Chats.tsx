import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import ContactsPermissionPrompt from "@/app/modules/contacts/components/SyncContacts";
import {useNavigation} from "expo-router";
import {getLocalChats} from "@/app/modules/chat/utils/storageApI";
import {List} from "react-native-paper";
import {Chat} from "@/app/modules/chat/types";
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Chat: { chatId: string; contactId: string; localName: string; lastMessage: string; updatedAt: number };
  Chats: undefined;
};

type ChatsNavigationProp = StackNavigationProp<RootStackParamList, 'Chats'>;

const Chats: React.FC = () => {
  const navigation = useNavigation<ChatsNavigationProp>();
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    (async () => {
      const storedChats = await getLocalChats();
      setChats(storedChats);
    })();
  }, []);

  const openChat = (chat: Chat) => {
    navigation.navigate("Chat", { ...chat });
  };

  return (
    <View>
      <ContactsPermissionPrompt />
      {chats.map((chat) => (
        <List.Item
          key={chat.chatId}
          title={chat.localName || "Chat"}
          description={chat.lastMessage || "last Message example"}
          left={(props) => <List.Icon {...props} icon="account" />}
          onPress={() => openChat(chat)}
        />
      ))}
    </View>
  );
};

export default Chats;
