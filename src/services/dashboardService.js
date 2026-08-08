import { apiClient } from './apiClient';

export async function getDashboardData() {
  return apiClient('/api/v1/dashboard');
}

export async function getHistoryData() {
  return apiClient('/api/v1/history/downloads');
}
