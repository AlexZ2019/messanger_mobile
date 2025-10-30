import {View} from "react-native";
import * as SecureStore from "expo-secure-store";
import {useEffect, useState} from "react";
import { List } from 'react-native-paper';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const storedContacts = await SecureStore.getItemAsync('contacts');
        if (storedContacts) {
          setContacts(JSON.parse(storedContacts));
        }
      } catch (error) {
        console.error('Error loading contacts:', error);
      }
    };

    loadContacts();
  }, []);

  return (
    <View>
      {contacts.map((contact, index) => (
        <List.Item
          key={contact.id}
          title={contact?.nickname || contact.firstname}
          left={props => <List.Icon {...props} icon={"account"} />}
        />
      ))}
    </View>
  )
}

export default Contacts;