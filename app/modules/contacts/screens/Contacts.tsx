  import {View} from "react-native";
  import * as SecureStore from "expo-secure-store";
  import {useEffect, useState} from "react";
  import {List} from 'react-native-paper';
  import {useNavigation} from "expo-router";
  import {useUser} from "@/app/modules/user/api/hooks";

  const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const navigation = useNavigation();
    const user = useUser()

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
      //TODO: for test VV
      if (user?.data?.email === "ashur@gmail.com") {
        const testContact = {
          firstname: "Test",
          id: "bbfd2cc7-9a94-4102-83a7-e2d6aaebeae1",
          lastname: "User",
          localName: "Oleksandr",
          nickname: "",
          phoneHash: "75945bcadab94d1eacbdfee580bdde82206912b5217dbb05d8abf43b01971f71"}
        setContacts([testContact]);
      }
      loadContacts();
    }, []);

    const openChat = (contact) => {
      //TODO: set same value in chats and contacts (localName \ contact name) in props
      navigation.navigate('ChatsStack', {
        screen: 'Chat',
        params: { localName: contact.localName, contactId: contact.id },
      });
    };

    return (
      <View>
        {contacts.map((contact, index) => (
          <List.Item
            key={contact.id}
            title={contact?.nickname || contact.firstname}
            left={props => <List.Icon {...props} icon={"account"} />}
            onPress={() => openChat(contact)}
          />
        ))}
      </View>
    )
  }

  export default Contacts;