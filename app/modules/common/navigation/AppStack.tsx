import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Chats from '@/app/modules/chat/screens/Chats';
import Chat from '@/app/modules/chat/screens/Chat';
import Contacts from '@/app/modules/contacts/screens/Contacts';
import { useChatListeners } from '@/app/modules/common/untils/useChatListeners';

type ChatsStackParamList = {
  Chats: undefined;
  Chat: { contactId: string; localName: string };
};

type ContactsStackParamList = {
  Contacts: undefined;
};

type TabParamList = {
  ChatsStack: undefined;
  ContactsStack: undefined;
};

type ChatsScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<ChatsStackParamList, 'Chats'>,
  BottomTabNavigationProp<TabParamList>
>;

const ChatsStackNavigator = () => {
  const Stack = createNativeStackNavigator<ChatsStackParamList>();
  const navigation = useNavigation<ChatsScreenNavigationProp>();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Chats"
        component={Chats}
        options={{
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
        }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={({ route }) => ({
          title: route.params.localName,
          headerBackTitle: 'Back',
        })}
      />
    </Stack.Navigator>
  );
};

const ContactsStackNavigator = () => {
  const Stack = createNativeStackNavigator<ContactsStackParamList>();

  return (
    <Stack.Navigator>
      <Stack.Screen name="Contacts" component={Contacts} options={{ title: 'Contacts' }} />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator<TabParamList>();

const AppStack = () => {
  useChatListeners();

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="ChatsStack"
        component={ChatsStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="chat" color={color} size={size} />,
          title: 'Chats',
        }}
      />
      <Tab.Screen
        name="ContactsStack"
        component={ContactsStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="account" color={color} size={size} />,
          title: 'Contacts',
        }}
      />
    </Tab.Navigator>
  );
};

export default AppStack;
