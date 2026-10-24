const KEY = 'hcm_token';

export function getToken() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null; // storage blocked
  }
}

export function setToken(token) {
  try {
    window.localStorage.setItem(KEY, token);
  } catch {
    // storage blocked: the user simply has to log in again next time
  }
}

export function clearToken() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // nothing to clear
  }
}
