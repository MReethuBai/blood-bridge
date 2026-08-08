import { apiClient } from './apiClient';

export async function signupUser(email, password, fullName, role = 'researcher') {
  const data = await apiClient('/api/v1/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, full_name: fullName, role })
  });
  return data;
}

export async function loginUser(email, password) {
  const data = await apiClient('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  if (data.access_token) {
    localStorage.setItem('intellearn_access_token', data.access_token);
    localStorage.setItem('intellearn_refresh_token', data.refresh_token);
    localStorage.setItem('intellearn_user', JSON.stringify(data.user));
  }
  return data;
}

export async function logoutUser() {
  try {
    await apiClient('/api/v1/auth/logout', { method: 'POST' });
  } catch (e) {
    console.warn('Logout API warning:', e);
  }
  localStorage.removeItem('intellearn_access_token');
  localStorage.removeItem('intellearn_refresh_token');
  localStorage.removeItem('intellearn_user');
}

export async function getUserProfile() {
  return apiClient('/api/v1/profile/me');
}

export async function updateUserProfile(profileData) {
  return apiClient('/api/v1/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
}
