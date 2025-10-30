import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Chats from "@/app/modules/chat/screens/Chats";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Contacts from "@/app/modules/contacts/screens/Contacts";

const Tab = createBottomTabNavigator();

export default function AppStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Chats" component={Chats} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="chat" color={color} size={size} />
        ),
      }}
      />
      <Tab.Screen name="Contacts" component={Contacts} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="chat" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
);
}
