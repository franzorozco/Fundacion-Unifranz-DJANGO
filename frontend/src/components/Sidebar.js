import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h2>Fundación</h2>

      <ul>
        <li onClick={() => navigate("/dashboard")}>Dashboard</li>
        <li>Donaciones</li>
        <li>Voluntarios</li>
        <li>Campañas</li>
      </ul>

      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}

export default Sidebar;