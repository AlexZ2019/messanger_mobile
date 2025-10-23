import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatsScreen from "@/app/modules/chat/screens/Chats";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

export default function AppStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Chats" component={ChatsScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="chat" color={color} size={size} />
        ),
      }}
      />
    </Tab.Navigator>
);
}
