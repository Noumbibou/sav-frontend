import { createContext, useContext, useState } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [agentId, setAgentId] = useState(localStorage.getItem('agentId'));
  const [name, setName] = useState(localStorage.getItem('name'));

  const login = async (email, password) => {
    const response = await axiosClient.post('/api/auth/login', { email, password });
    const { token, role, agentId, name } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    if (agentId) localStorage.setItem('agentId', agentId);
    localStorage.setItem('name', name);

    setToken(token);
    setRole(role);
    setAgentId(agentId);
    setName(name);

    return role;
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setAgentId(null);
    setName(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, role, agentId, name, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}