import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Account, AccountFormData, AccountErrors, MetkaItem } from '../types/account.types';

export const useAccountStore = defineStore('accounts', () => {
  const loadAccounts = (): Account[] => {
    const saved = localStorage.getItem('accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error('Ошибка парса localStorage', e);
      }
    }
    return [];
  };

  const accounts = ref<Account[]>(loadAccounts());

  watch(accounts, (newAccounts) => {
    localStorage.setItem('accounts', JSON.stringify(newAccounts));
  }, { deep: true });

  const addAccount = (): Account => {
    const newAccount: Account = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      formData: {
        metkaRaw: '',
        type: 'local',
        login: '',
        password: ''
      },
      errors: {},
      metka: []
    };
    accounts.value.push(newAccount);
    return newAccount;
  };

  const updateAccount = (id: string, formData: Partial<AccountFormData>): void => {
    const index = accounts.value.findIndex(acc => acc.id === id);
    if (index !== -1) {
      const account = accounts.value[index];
      if (account) {
        account.formData = {
          ...account.formData,
          ...formData
        };
      }
    }
  };

  const updateErrors = (id: string, errors: AccountErrors): void => {
    const index = accounts.value.findIndex(acc => acc.id === id);
    if (index !== -1) {
      const account = accounts.value[index];
      if (account) {
        account.errors = errors;
      }
    }
  };

  const updateMetka = (id: string, metka: MetkaItem[]): void => {
    const index = accounts.value.findIndex(acc => acc.id === id);
    if (index !== -1) {
      const account = accounts.value[index];
      if (account) {
        account.metka = metka;
      }
    }
  };

  const deleteAccount = (id: string): void => {
    accounts.value = accounts.value.filter(acc => acc.id !== id);
  };

  return {
    accounts,
    addAccount,
    updateAccount,
    updateErrors,
    updateMetka,
    deleteAccount
  };
});