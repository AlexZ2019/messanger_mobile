import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Chats from "@/app/modules/chat/screens/Chats";
import Contacts from "@/app/modules/contacts/screens/Contacts";

const Tab = createBottomTabNavigator();

export default function AppStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Chats"
        component={Chats}
        options={({ navigation }) => ({
          tabBarIcon: ({ color, size }) => (
            <Icon name="chat" color={color} size={size} />
          ),
          title: 'Chats',
          headerRight: () => (
            <Button
              mode="text"
              onPress={() => navigation.navigate('Contacts')} // ✅ Тепер працює!
              style={{ marginRight: 10 }}
              compact
            >
              <Icon name="plus" size={24} />
            </Button>
          ),
        })}
      />

      <Tab.Screen
        name="Contacts"
        component={Contacts}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          ),
          title: 'Contacts',
        }}
      />
    </Tab.Navigator>
  );
}
