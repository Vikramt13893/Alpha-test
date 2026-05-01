import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { clearSession, getAccessToken, getStoredEmail, loginRequest, registerRequest, setSession } from './auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getAccessToken());
  const [email, setEmail] = useState(() => getStoredEmail());

  const login = useCallback(async (e, p) => {
    const data = await loginRequest(e, p);
    setSession(data.accessToken, data.email);
    setToken(data.accessToken);
    setEmail(data.email);
    return data;
  }, []);

  const register = useCallback(async (e, p) => {
    const data = await registerRequest(e, p);
    setSession(data.accessToken, data.email);
    setToken(data.accessToken);
    setEmail(data.email);
    return data;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setEmail(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      email,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [token, email, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
