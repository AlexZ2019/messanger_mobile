import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {ChatsScreenNavigationProp, ChatsStackParamList} from "@/app/modules/common/types";
import {useNavigation} from "@react-navigation/native";
import Chats from "@/app/modules/chat/screens/Chats";
import {Button} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Chat from "@/app/modules/chat/screens/Chat";
import React from "react";

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

export default ChatsStackNavigator;