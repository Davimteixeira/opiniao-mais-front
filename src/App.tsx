import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import NPS from "./NPS";
import Login from "./Login";
import Admin from "./Admin";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSuperUser, setIsSuperUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setIsAuthenticated(true);
      setIsSuperUser(parsedUser.is_superuser);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Carregando...</div>; 
  }

  return (
    <Router>
      <Routes>
        {/* 🔹 Página Inicial: Sempre iniciar pelo Login */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              isSuperUser ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/nps" />
              )
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} setIsSuperUser={setIsSuperUser} />
            )
          }
        />

        {/* 🔹 Proteção da Rota do Dashboard */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />

        {/* 🔹 Proteção da Rota do Admin (Apenas Superusuários) */}
        <Route 
          path="/admin" 
          element={isAuthenticated && isSuperUser ? <Admin /> : <Navigate to="/login" />} 
        />

        {/* 🔹 Página de Login */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setIsSuperUser={setIsSuperUser} />} />
        
        {/* 🔹 Proteção da Rota Default - Exige Login */}
        <Route path="/nps" element={isAuthenticated ? <NPS /> : <Navigate to="/login" />} />

        {/* 🔹 Rota para casos não especificados */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
