import * as SecureStore from "expo-secure-store";
import {Contact} from "@/app/modules/contacts/types";

export const getContacts = async (): Promise<Contact[]> => {
  const raw = await SecureStore.getItemAsync('contacts');
  return raw ? JSON.parse(raw) : [];
};