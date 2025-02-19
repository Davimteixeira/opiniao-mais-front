import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import NPS from "./NPS";
import Login from "./Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NPS />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;