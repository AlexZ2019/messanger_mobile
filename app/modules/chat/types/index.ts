import {RouteProp} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
}

export type Chat = {
  chatId: string;
  contactId: string;
  localName: string;
  lastMessage: string;
  updatedAt: number;
}

export type RootStackParamChat = {
  Chat: { contactId: string; localName: string };
};

export type ChatRoomScreenRouteProp = RouteProp<RootStackParamChat, 'Chat'>;

export type ChatRoomScreenNavigationProp = StackNavigationProp<RootStackParamChat, 'Chat'>;