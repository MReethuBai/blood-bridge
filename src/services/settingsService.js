import { apiClient } from './apiClient';

export async function getSettings() {
  return apiClient('/api/v1/settings');
}

export async function updateSettings(settingsData) {
  return apiClient('/api/v1/settings', {
    method: 'PUT',
    body: JSON.stringify(settingsData)
  });
}
