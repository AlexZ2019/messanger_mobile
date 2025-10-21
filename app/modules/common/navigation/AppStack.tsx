import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatsScreen from "@/app/modules/chat/screens/Chats";

const Tab = createBottomTabNavigator();

export default function AppStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Chats" component={ChatsScreen} />
    </Tab.Navigator>
);
}
