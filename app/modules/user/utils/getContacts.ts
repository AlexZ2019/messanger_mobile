import * as Contacts from 'expo-contacts';
import {PhoneNumber} from 'expo-contacts';
import {LocalContact} from '@/app/modules/user/types';
import {sha256} from '@/app/modules/common/untils/hashString';

const COUNTRY_CODES: Record<string, string> = {
  ua: '380',
  pl: '48',
  us: '1',
  de: '49',
  fr: '33',
  gb: '44',
};

function normalizePhoneNumber(num?: PhoneNumber): string | undefined {
  if (!num) return;

  let digits = num?.digits?.replace(/\D/g, '');

  const code = COUNTRY_CODES[num?.countryCode?.toLowerCase() || ''];
  if (!code) return;

  if (!digits?.startsWith(code)) {
    if (digits?.startsWith('0')) digits = digits.slice(1);
    digits = code + digits;
  }

  return digits;
}

export async function getContacts(): Promise<LocalContact[]> {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== 'granted') return [];

  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers],
  });

  const contactPromises = data.reduce<Promise<LocalContact[]>[]>((acc, c) => {
    if (!c.phoneNumbers?.length) return acc;

    const promises = c.phoneNumbers.map(async (n) => {
      return {
        localName: c.name,
        phoneHash: await sha256(normalizePhoneNumber(n)),
      }
    });

    acc.push(Promise.all(promises));
    return acc;
  }, []);

  const resolved = await Promise.all(contactPromises);
  return resolved.flat();
}