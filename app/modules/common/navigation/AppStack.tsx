import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Chats from '@/app/modules/chat/screens/Chats';
import Chat from '@/app/modules/chat/screens/Chat';
import Contacts from '@/app/modules/contacts/screens/Contacts';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ChatsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Chats"
      component={Chats}
      options={({ navigation }) => ({
        title: 'Chats',
        headerRight: () => (
          <Button
            mode="text"
            onPress={() => navigation.navigate('ContactsStack')}
            style={{ marginRight: 10 }}
            compact
          >
            <Icon name="plus" size={24} />
          </Button>
        ),
      })}
    />
    <Stack.Screen
      name="Chat"
      component={Chat}
      options={({ route }) => ({
        title: route.params?.contactName || 'Chat',
        headerBackTitle: 'Back',
      })}
    />
  </Stack.Navigator>
);

const ContactsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Contacts"
      component={Contacts}
      options={{ title: 'Contacts' }}
    />
  </Stack.Navigator>
);

const AppStack = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="ChatsStack"
      component={ChatsStack}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="chat" color={color} size={size} />,
        title: 'Chats',
      }}
    />

    <Tab.Screen
      name="ContactsStack"
      component={ContactsStack}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="account" color={color} size={size} />,
        title: 'Contacts',
      }}
    />
  </Tab.Navigator>
);

export default AppStack;
