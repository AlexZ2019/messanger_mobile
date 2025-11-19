import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ContactsPermissionPrompt from "@/app/modules/contacts/components/SyncContacts";
import { useNavigation } from "expo-router";
import { List } from "react-native-paper";
import { Chat } from "@/app/modules/chat/types";
import { getChatsList } from "@/app/modules/chat/utils/storageApI";
import { ChatsScreenNavigationProp } from "@/app/modules/common/types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Chats: React.FC = () => {
  const navigation = useNavigation<ChatsScreenNavigationProp>();
  const [chats, setChats] = useState<Chat[]>(() => []);

  useEffect(() => {
    const loadChats = async () => {
      const storedChats = await getChatsList();
      setChats(storedChats);
    };

    loadChats();
  }, []);

  const openChat = useCallback(
    (chat: Chat) => navigation.navigate("Chat", { ...chat }),
    [navigation]
  );

  return (
    <View style={styles.container}>
      <ContactsPermissionPrompt />
      {chats.length === 0 ? (
        <List.Item title="No chats yet" description="Start a conversation" />
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(chat) => chat.chatId}
          renderItem={({ item }) => (
            <List.Item
              title={item.localName || "Chat"}
              description={item.lastMessage || "last Message example"}
              left={(props) => <List.Icon {...props} icon="account" />}
              onPress={() => openChat(item)}
            />
          )}
        />
      )}
    </View>
  );
};

export default Chats;
