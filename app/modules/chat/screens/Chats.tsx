import React from 'react';
import { View, Text } from 'react-native';
import ContactsPermissionPrompt from "@/app/modules/user/components/SyncContacts";

export default function ChatsScreen() {
  return (
    <View>
      <ContactsPermissionPrompt/>
      <Text>Chats</Text>
    </View>
  );
}
