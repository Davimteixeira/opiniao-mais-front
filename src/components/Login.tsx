import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; 

interface LoginProps {
  setIsAuthenticated: (auth: boolean) => void;
  setIsSuperUser: (isSuper: boolean) => void;
}

export default function Login({ setIsAuthenticated, setIsSuperUser }: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setError("Email inválido!");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    try {
      const response = await api.post("/accounts/token/", { email, password });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setIsAuthenticated(true);
      setIsSuperUser(response.data.user.is_superuser);

      if (response.data.user.is_superuser) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm">Senha</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-600 transition text-sm sm:text-base"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
