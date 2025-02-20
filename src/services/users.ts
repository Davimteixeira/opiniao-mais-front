import api from './api';
import type {
  CreateUserPayload,
  UpdateUserPayload,
  ResetPasswordPayload,
  DeleteUserPayload,
  User,
  UsersResponse,
} from '../types/user';

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<UsersResponse>('/accounts/users/');
    console.log('Resposta da API:', response.data); // Depuração

    if (!response.data || !Array.isArray(response.data.results)) {
      throw new Error('Formato inesperado da resposta da API.');
    }

    return response.data.results;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw new Error('Erro ao buscar usuários. Tente novamente.');
  }
};

export const createUser = async (
  userData: CreateUserPayload
): Promise<User> => {
  try {
    const response = await api.post('/accounts/register/user/', userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw new Error(
      'Erro ao criar usuário. Verifique os dados e tente novamente.'
    );
  }
};

export const updateUser = async (
  userData: UpdateUserPayload
): Promise<User> => {
  try {
    const response = await api.put(`/accounts/update-user/`, userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw new Error(
      'Erro ao atualizar usuário. Verifique os dados e tente novamente.'
    );
  }
};

export const resetPassword = async (
  data: ResetPasswordPayload
): Promise<void> => {
  try {
    await api.post('/accounts/reset-password/', data);
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    throw new Error(
      'Erro ao redefinir senha. Verifique os dados e tente novamente.'
    );
  }
};

export const deleteUser = async (data: DeleteUserPayload): Promise<void> => {
  try {
    await api.delete(`/accounts/delete-user/`, { data });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    throw new Error(
      'Erro ao excluir usuário. Verifique os dados e tente novamente.'
    );
  }
};
