import {ReactNode} from "react";
import {CompositeNavigationProp, NavigatorScreenParams, ParamListBase} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {BottomTabNavigationProp} from "@react-navigation/bottom-tabs";
import {NavigationProp} from "@react-navigation/core";

export type BaseProvider = {
  children: ReactNode;
};

export type ChatsStackParamList = {
  Chats: undefined;
  Chat: { contactId: string; localName: string };
};

export type TabParamList = {
  ChatsStack: NavigatorScreenParams<ChatsStackParamList>;
  ContactsStack: undefined;
};

export type ContactsStackParamList = {
  Contacts: undefined;
};

export type Nav<
  A extends NavigationProp<ParamListBase>,
  B extends NavigationProp<ParamListBase>
> = CompositeNavigationProp<A, B>;


export type ChatsScreenNavigationProp = Nav<
  NativeStackNavigationProp<ChatsStackParamList, 'Chats'>,
  BottomTabNavigationProp<TabParamList>
>;

export type ContactsNavigationProp = Nav<
  BottomTabNavigationProp<TabParamList, 'ContactsStack'>,
  NativeStackNavigationProp<ChatsStackParamList>
>;
