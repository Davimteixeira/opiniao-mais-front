import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import type { User } from '../types/user';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { email: string; new_password: string }) => void;
  user: User | null;
}

export function PasswordModal({ isOpen, onClose, onSubmit, user }: PasswordModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const passwordInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setNewPassword(''); 
      setErrorMessage('');
      passwordInputRef.current?.focus();
    }
  }, [isOpen]);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres';
    }
    if (!/[A-Z]/.test(password)) {
      return 'A senha deve conter pelo menos uma letra maiúscula';
    }
    if (!/\d/.test(password)) {
      return 'A senha deve conter pelo menos um número';
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const validationMessage = validatePassword(newPassword);
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    onSubmit({
      email: user.email,
      new_password: newPassword,
    });

    onClose(); 
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Alterar Senha</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fechar modal"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nova Senha
            </label>
            <div className="relative">
              <input
                ref={passwordInputRef}
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setErrorMessage('');
                }}
                className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errorMessage && <p className="text-red-600 text-sm mt-1">{errorMessage}</p>}
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
              className={`px-4 py-2 rounded-lg text-white transition ${
                errorMessage ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={!!errorMessage}
            >
              Atualizar Senha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
