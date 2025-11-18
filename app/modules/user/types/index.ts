export interface LocalContact {
  localName: string;
  phoneHash: string | null;
}

export type User = { id: string; email: string; name?: string } | null;