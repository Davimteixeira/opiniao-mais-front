export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  contract_type: ContractType;
  request_limit: number;
}

export interface CreateUserPayload {
  email: string;
  username: string;
  first_name: string;
  password: string;
  contract_type: ContractType;
  request_limit: number;
}

export interface UpdateUserPayload {
  user_id: number;
  contract_type?: ContractType;
  request_limit?: number;
}

export interface ResetPasswordPayload {
  email: string;
  new_password: string;
}

export interface DeleteUserPayload {
  user_id: number;
}

export interface UsersResponse {
  results: User[];
}

// 🔹 Definição segura dos tipos de contrato
export const CONTRACT_TYPES = {
  BASIC: 1,
  ENTERPRISE: 2,
} as const;

export type ContractType = (typeof CONTRACT_TYPES)[keyof typeof CONTRACT_TYPES]; // 🔹 Garante que só aceita 1 ou 2

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  [CONTRACT_TYPES.BASIC]: 'Plano Basic',
  [CONTRACT_TYPES.ENTERPRISE]: 'Plano Enterprise',
};
