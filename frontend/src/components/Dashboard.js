import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [donaciones, setDonaciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/donaciones/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setDonaciones(data));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard</h1>
        <button onClick={logout}>Cerrar sesión</button>
      </header>

      <div className="cards">
        {donaciones.map((d) => (
          <div className="card" key={d.id}>
            <h3>{d.titulo}</h3>
            <p>{d.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;