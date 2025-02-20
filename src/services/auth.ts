import api from './api';

export const login = async (email: string, password: string) => {
  const response = await api.post('/accounts/token/', { email, password });

  const { access, refresh, user } = response.data;

  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
  localStorage.setItem('user', JSON.stringify(user));

  return { access, refresh, user };
};
