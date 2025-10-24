import * as Contacts from 'expo-contacts';
import { LocalContact } from '@/app/modules/user/types';
import { sha256 } from '@/app/modules/common/untils/hashString';

function normalizePhoneNumber(num?: string): string {
  if (!num) return '';
  return num.replace(/[\s\-\(\)\+]/g, '');
}

export async function getContacts(): Promise<LocalContact[]> {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== 'granted') return [];

  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers],
  });

  const contactPromises = data.reduce<Promise<LocalContact[]>[]>((acc, c) => {
    if (!c.phoneNumbers?.length) return acc;

    const promises = c.phoneNumbers.map(async (n) => ({
      localName: c.name,
      phoneHash: await sha256(normalizePhoneNumber(n.number)),
    }));

    acc.push(Promise.all(promises));
    return acc;
  }, []);

  const resolved = await Promise.all(contactPromises);
  return resolved.flat();
}