export interface MetkaItem {
  text: string;
}

export type AccountType = 'local' | 'ldap';

export interface AccountFormData {
  metkaRaw: string;
  type: AccountType;
  login: string;
  password: string | null;
}

export interface AccountErrors {
  metka?: string;
  type?: string;
  login?: string;
  password?: string;
}

export interface Account {
  id: string;
  formData: AccountFormData;
  errors: AccountErrors;
  metka: MetkaItem[];
}

export interface SelectOption {
  label: string;
  value: AccountType;
}