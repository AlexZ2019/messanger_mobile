import React, {useEffect, useState} from 'react';
import {Button, Modal, Text, View, StyleSheet} from 'react-native';
import * as Contacts from 'expo-contacts';
import useModal from "@/app/modules/common/untils/useModal";
import * as SecureStore from "expo-secure-store";
import {getContacts} from "@/app/modules/contacts/utils/getContacts";
import {useSyncContacts} from "@/app/modules/contacts/api/hooks";

const ContactsPermissionPrompt = () => {
  const modal = useModal();
  const { mutate } = useSyncContacts();

  useEffect(() => {
    const timer = setTimeout(async () => {
      const contacts = await SecureStore.getItemAsync('contacts');
      if (!contacts) modal.showModal();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const syncContacts = async () => {
    modal.hideModal();

    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const contacts = await getContacts();
      if (contacts) {
        mutate(contacts);
      }
    }
  };

  return (
    <Modal visible={modal.isVisible} animationType="fade" transparent={false}>
      <View style={styles.fullScreenContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Дозволь доступ до контактів</Text>
          <Text style={styles.subtitle}>
            Ми покажемо, хто з твоїх друзів уже користується додатком.
          </Text>
          <Button title="Дозволити" onPress={syncContacts} />
          <Button title="Пізніше" onPress={modal.hideModal} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#f9f9f9',
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 16,
  },
});

export default ContactsPermissionPrompt;