import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {ContactsStackParamList} from "@/app/modules/common/types";
import Contacts from "@/app/modules/contacts/screens/Contacts";
import React from "react";

const ContactsStackNavigator = () => {
  const Stack = createNativeStackNavigator<ContactsStackParamList>();

  return (
    <Stack.Navigator>
      <Stack.Screen name="Contacts" component={Contacts} options={{ title: 'Contacts' }} />
    </Stack.Navigator>
  );
};

export default ContactsStackNavigator;