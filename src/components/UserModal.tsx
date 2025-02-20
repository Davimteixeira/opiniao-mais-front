import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import type { User } from '../types/user';
import { CONTRACT_TYPES, CONTRACT_TYPE_LABELS, ContractType } from '../types/user';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  editingUser: User | null;
}

export function UserModal({ isOpen, onClose, onSubmit, editingUser }: UserModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<{
    email: string;
    username: string;
    first_name: string;
    password: string;
    contract_type: ContractType; 
    request_limit: number;
  }>({
    email: '',
    username: '',
    first_name: '',
    password: '',
    contract_type: CONTRACT_TYPES.BASIC, 
    request_limit: 3000,
  });

  useEffect(() => {
    if (isOpen) {
      if (editingUser) {
        setFormData({
          email: editingUser.email,
          username: editingUser.username,
          first_name: editingUser.first_name,
          password: '', 
          contract_type: editingUser.contract_type as ContractType, 
          request_limit: editingUser.request_limit ?? 3000,
        });
      } else {
     
        setFormData({
          email: '',
          username: '',
          first_name: '',
          password: '',
          contract_type: CONTRACT_TYPES.BASIC,
          request_limit: 3000,
        });
      }
    }
  }, [isOpen, editingUser]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'contract_type' ? (Number(value) as ContractType) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campos de Email, Username e Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!!editingUser}
              className={`w-full border rounded-lg px-3 py-2 ${
                editingUser ? "bg-gray-100 cursor-not-allowed" : "focus:outline-none focus:ring-2 focus:ring-blue-500"
              }`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={!!editingUser} 
              className={`w-full border rounded-lg px-3 py-2 ${
                editingUser ? "bg-gray-100 cursor-not-allowed" : "focus:outline-none focus:ring-2 focus:ring-blue-500"
              }`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              disabled={!!editingUser} 
              className={`w-full border rounded-lg px-3 py-2 ${
                editingUser ? "bg-gray-100 cursor-not-allowed" : "focus:outline-none focus:ring-2 focus:ring-blue-500"
              }`}
              required
            />
          </div>

          {/* Campo de Senha (Só aparece ao criar usuário) */}
          {!editingUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          {/* Campos que podem ser editados sempre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Contrato</label>
            <select
              name="contract_type"
              value={formData.contract_type}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {Object.entries(CONTRACT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={Number(value)}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Limite de Requisições</label>
            <input
              type="number"
              name="request_limit"
              value={formData.request_limit}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min={0}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingUser ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
