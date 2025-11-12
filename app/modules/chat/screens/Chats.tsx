import React, {useEffect, useState} from 'react';
import { View, Text } from 'react-native';
import ContactsPermissionPrompt from "@/app/modules/contacts/components/SyncContacts";
import {useNavigation} from "expo-router";
import {getLocalChats} from "@/app/modules/chat/utils/storageApI";
import {List} from "react-native-paper";

export default function Chats() {
  const navigation = useNavigation();
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const storedChats = await getLocalChats();
      setChats(storedChats);
    })();
  }, []);

  const openChat = (chat) => {
    navigation.navigate('Chat', chat)
  };

  return (
    <View>
      <ContactsPermissionPrompt/>
      {chats?.map((chat, index) => (
        <List.Item
          key={chat.chatId}
          title={chat.contactName}
          description={chat?.lastMessage || "last Message example"}
          left={props => <List.Icon {...props} icon={"account"} />}
          onPress={() => openChat(chat)}
        />
      ))}
    </View>
  );
}
