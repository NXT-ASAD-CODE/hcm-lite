import api from '@/lib/apiClient';

export async function getSetupStatus() {
  const res = await api.get('/setup/status');
  return res.data.data; // { needsSetup }
}

export async function createSetup(payload) {
  const res = await api.post('/setup', payload);
  return res.data;
}

export async function login(payload) {
  const res = await api.post('/auth/login', payload);
  return res.data.data; // { token, user }
}

export async function getMe() {
  const res = await api.get('/auth/me');
  return res.data.data;
}

export async function changePassword(payload) {
  const res = await api.post('/auth/change-password', payload);
  return res.data;
}
