import React, {useEffect, useState} from 'react';
import {Button, Modal, Text, View} from 'react-native';
import * as Contacts from 'expo-contacts';
import useModal from "@/app/modules/common/untils/useModal";
import * as SecureStore from "expo-secure-store";
import {getContacts} from "@/app/modules/user/utils/getContacts";
import {useSyncContacts} from "@/app/modules/auth/api/hooks";

const ContactsPermissionPrompt = () => {
  const modal = useModal()
  const [alreadyAsked, setAlreadyAsked] = useState(false)
  const { mutate } = useSyncContacts()

  useEffect(() => {
    const timer = setTimeout(async () => {
      const isContactsAsked = await SecureStore.getItemAsync('isContactAsked')
      setAlreadyAsked(isContactsAsked === 'true')
      if (!alreadyAsked) modal.showModal();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const requestPermission = async () => {
    setAlreadyAsked(true);
    modal.hideModal()

    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const contacts = await getContacts();
      console.log('contacts', contacts)
      mutate(contacts)
    }
  };

  return (
    <Modal visible={modal.isVisible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="bg-white p-6 rounded-2xl w-80">
          <Text className="text-lg font-semibold mb-3 text-center">
            Дозволь доступ до контактів
          </Text>
          <Text className="text-center mb-5 text-gray-600">
            Ми покажемо, хто з твоїх друзів уже користується додатком.
          </Text>
          <Button title="Дозволити" onPress={requestPermission} />
          <Button title="Пізніше" onPress={modal.hideModal} />
        </View>
      </View>
    </Modal>
  );
};

export default ContactsPermissionPrompt;