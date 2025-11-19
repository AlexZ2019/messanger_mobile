import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {TabParamList} from "@/app/modules/common/types";
import {useSocketListeners} from "@/app/modules/chat/utils/useSocketListeners";
import ChatsStackNavigator from "@/app/modules/chat/stacks/ChatsStackNavigator";
import ContactsStackNavigator from "@/app/modules/contacts/stacks/stacks";

const Tab = createBottomTabNavigator<TabParamList>();

const AppStack = () => {
  useSocketListeners();

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
