import React from 'react';
import { View, Text } from 'react-native';
import ContactsPermissionPrompt from "@/app/modules/contacts/components/SyncContacts";

export default function Chats() {
  return (
    <View>
      <ContactsPermissionPrompt/>
      <Text>Chats</Text>
    </View>
  );
}
