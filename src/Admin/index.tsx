import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, UserPlus, Search, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import type { User } from '../types/user';
import { CONTRACT_TYPE_LABELS } from '../types/user';
import { UserModal } from '../components/UserModal';
import { PasswordModal } from '../components/PasswordModal';
import { getUsers, createUser, updateUser, resetPassword, deleteUser } from '../services/users';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersArray = await getUsers();
      console.log("Usuários recebidos da API:", usersArray);
  
      if (Array.isArray(usersArray)) {
        setUsers(usersArray);
      } else {
        console.error("Erro: A API não retornou um array válido", usersArray);
        setUsers([]); 
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toast.error("Erro ao carregar usuários");
      setUsers([]); 
    }
  };

  const handleCreateUser = async (formData: any) => {
    try {
      await createUser(formData);
      toast.success('Usuário criado com sucesso');
      setIsUserModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error('Erro ao criar usuário');
    }
  };

  const handleUpdateUser = async (formData: any) => {
    if (!editingUser) return;

    try {
      await updateUser({
        user_id: editingUser.id,
        contract_type: formData.contract_type,
        request_limit: formData.request_limit,
      });
      toast.success('Usuário atualizado com sucesso');
      setIsUserModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error('Erro ao atualizar usuário');
    }
  };

  const handlePasswordReset = async (data: { email: string; new_password: string }) => {
    try {
      await resetPassword(data);
      toast.success('Senha alterada com sucesso');
      setIsPasswordModalOpen(false);
    } catch (error) {
      toast.error('Erro ao alterar senha');
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      await deleteUser({ user_id: userId });
      toast.success('Usuário excluído com sucesso');
      fetchUsers();
    } catch (error) {
      toast.error('Erro ao excluir usuário');
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-blue-800">Gestão de Usuários</h1>
          <button
            onClick={() => {
              setEditingUser(null);
              setIsUserModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <UserPlus size={20} /> Adicionar Usuário
          </button>
        </div>

        <div className="mb-6 flex items-center gap-2 bg-white p-4 rounded-lg shadow">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por username ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase">Tipo de Contrato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase">Limite de Requisições</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.first_name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      user.contract_type === 1 ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {CONTRACT_TYPE_LABELS[user.contract_type]}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.request_limit ?? "N/A"}</td>
                  <td className="px-6 py-4 flex gap-3">
                    <button className="text-gray-500 hover:text-gray-700" onClick={() => { setEditingUser(user); setIsUserModalOpen(true); }}>
                      <Pencil size={20} />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700" onClick={() => { setEditingUser(user); setIsPasswordModalOpen(true); }}>
                      <Lock size={20} />
                    </button>
                    <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(user.id)}>
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSubmit={editingUser ? handleUpdateUser : handleCreateUser} editingUser={editingUser} />
      <PasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} onSubmit={handlePasswordReset} user={editingUser} />
    </div>
  );
}

export default App;
