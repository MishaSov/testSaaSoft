<template>
  <div class="accounts-container">
    <div class="header">
      <h1>Учетные записи</h1>
      <Button 
        label="Добавить учетную запись" 
        icon="pi pi-plus" 
        @click="addNewAccount"
      />
    </div>

    <div class="hint">
      <i class="pi pi-info-circle"></i>
      <span>Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</span>
    </div>

    <div class="accounts-table">
      <div class="table-header">
        <div class="col-marks">Метки</div>
        <div class="col-type">Тип записи</div>
        <div class="col-login">Логин</div>
        <div class="col-password">Пароль</div>
        <div class="col-actions"></div>
      </div>

      <div class="table-body">
        <div v-for="account in accounts" :key="account.id" class="table-row">
          <div class="col-marks">
            <InputText
              v-model="account.formData.metkaRaw"
              @blur="() => validateAndSave(account)"
              placeholder="Метки через ;"
              :maxlength="50"
              :class="{ 'p-invalid': account.errors.metka }"
              fluid
            />
            <small v-if="account.errors.metka" class="error-text">{{ account.errors.metka }}</small>
          </div>

          <div class="col-type">
            <Select
              v-model="account.formData.type"
              @change="() => handleTypeChange(account)"
              :options="accountTypes"
              optionLabel="label"
              optionValue="value"
              placeholder="Выберите тип"
              :class="{ 'p-invalid': account.errors.type }"
              fluid
            />
            <small v-if="account.errors.type" class="error-text">{{ account.errors.type }}</small>
          </div>

          <div class="col-login">
            <InputText
              v-model="account.formData.login"
              @blur="() => validateAndSave(account)"
              placeholder="Логин"
              :maxlength="100"
              :class="{ 'p-invalid': account.errors.login }"
              fluid
            />
            <small v-if="account.errors.login" class="error-text">{{ account.errors.login }}</small>
          </div>

          <div class="col-password">
            <div v-if="account.formData.type === 'local'">
              <InputText
                v-model="account.formData.password"
                @blur="() => validateAndSave(account)"
                placeholder="Пароль"
                :maxlength="100"
                :class="{ 'p-invalid': account.errors.password }"
                type="password"
                fluid
              />
              <small v-if="account.errors.password" class="error-text">{{ account.errors.password }}</small>
            </div>
            <div v-else class="password-not-required">
              <span>Не требуется</span>
            </div>
          </div>

          <div class="col-actions">
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              @click="deleteAccount(account.id)"
            />
          </div>
        </div>

        <div v-if="accounts.length === 0" class="empty-state">
          <i class="pi pi-database"></i>
          <p>Нет учетных записей</p>
          <p class="text-sm">Нажмите "Добавить учетную запись", чтобы создать первую</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAccountStore } from '../stores/accountStore';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import type { Account, SelectOption } from '../types/account.types';

const accountTypes: SelectOption[] = [
  { label: 'Локальная', value: 'local' },
  { label: 'LDAP', value: 'ldap' }
];

const accountStore = useAccountStore();
const { accounts } = storeToRefs(accountStore);

const addNewAccount = (): void => {
  accountStore.addAccount();
};

const deleteAccount = (id: string): void => {
  accountStore.deleteAccount(id);
};

const handleTypeChange = (account: Account): void => {
  if (account.formData.type !== 'local') {
    account.formData.password = null;
  }
  validateAndSave(account);
};

const validateAndSave = (account: Account): void => {
  const errors: Record<string, string> = {};

  if (!account.formData.login?.trim()) {
    errors.login = 'Обязательное поле';
  } else if (account.formData.login.length > 100) {
    errors.login = 'Максимум 100 символов';
  }

  if (account.formData.type === 'local') {
    if (!account.formData.password?.trim()) {
      errors.password = 'Обязательное поле';
    } else if (account.formData.password.length > 100) {
      errors.password = 'Максимум 100 символов';
    }
  }

  if (account.formData.metkaRaw?.length > 50) {
    errors.metka = 'Максимум 50 символов';
  }

  account.errors = errors;
  accountStore.updateErrors(account.id, errors);

  if (Object.keys(errors).length === 0) {
    const metkaArray = account.formData.metkaRaw
      ? account.formData.metkaRaw
          .split(';')
          .map((s) => ({ text: s.trim() }))
          .filter((item) => item.text)
      : [];
    accountStore.updateMetka(account.id, metkaArray);
    account.metka = metkaArray;
  }
};
</script>

<style scoped>
.accounts-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #1a1a1a;
  margin: 0;
}

.hint {
  background-color: #eff6ff;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1e40af;
  font-size: 14px;
}

.hint i {
  color: #3b82f6;
  font-size: 16px;
}

.accounts-table {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 200px 150px 1fr 200px 50px;
  gap: 12px;
  padding: 12px 16px;
  background-color: #f3f4f6;
  font-weight: 500;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.table-row {
  display: grid;
  grid-template-columns: 200px 150px 1fr 200px 50px;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #f9fafb;
}

.table-row:last-child {
  border-bottom: none;
}

.col-marks,
.col-type,
.col-login,
.col-password,
.col-actions {
  min-width: 0;
}

.error-text {
  display: block;
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}

.password-not-required {
  color: #6b7280;
  font-style: italic;
  font-size: 14px;
  padding-top: 8px;
}

.empty-state {
  text-align: center;
  padding: 48px;
  color: #9ca3af;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  color: #d1d5db;
}

.empty-state p {
  margin: 4px 0;
}

.empty-state .text-sm {
  font-size: 14px;
  color: #9ca3af;
}


</style>