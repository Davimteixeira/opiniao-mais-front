import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to include access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token enviado:', config.headers.Authorization);
    } else {
      console.warn('⚠️ Nenhum token encontrado no localStorage!');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ Token expirado. Tentando renovar...');

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error(
            'Sem token de atualização. Redirecionando para login...'
          );
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/accounts/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        localStorage.setItem('access_token', response.data.access);
        console.log('✅ Novo token gerado:', response.data.access);

        // Update original request with new token and resend
        error.config.headers.Authorization = `Bearer ${response.data.access}`;
        return axios(error.config);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
