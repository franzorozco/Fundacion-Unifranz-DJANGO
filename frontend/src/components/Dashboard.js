import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function Dashboard() {
  const [donaciones, setDonaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/donaciones/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setDonaciones(data);
        } else if (Array.isArray(data.results)) {
          setDonaciones(data.results); // Django con paginación
        } else {
          setDonaciones([]); // fallback seguro
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  const logout = () => {
    const confirmLogout = window.confirm("¿Seguro que quieres cerrar sesión?");
    if (!confirmLogout) return;

    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const totalDonaciones = donaciones.length;

  const activas = donaciones.filter(
    (d) => d.estado === "activo"
  ).length;

  const completadas = donaciones.filter(
    (d) => d.estado === "completado"
  ).length;

  const pieData = {
    labels: ["Activas", "Completadas"],
    datasets: [
      {
        data: [activas, completadas],
        backgroundColor: ["#14b8a6", "#ec4899"],
        borderWidth: 1,
      },
    ],
  };

  const agrupadas = {};
  donaciones.forEach((d) => {
    agrupadas[d.titulo] = (agrupadas[d.titulo] || 0) + 1;
  });

  const barData = {
    labels: Object.keys(agrupadas),
    datasets: [
      {
        label: "Donaciones",
        data: Object.values(agrupadas),
        backgroundColor: "#14b8a6",
      },
    ],
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        {/* HEADER */}
        <header className="dashboard-header">
          <div>
            <h1>Panel principal</h1>
            <p className="subtitle">
              Resumen general del sistema
            </p>
          </div>

          <div className="header-actions">
            <button className="primary-btn">
              Nueva donación
            </button>
          </div>
        </header>

        {/* STATS */}
        <section className="stats">
          <div className="stat-card">
            <h3>Total donaciones</h3>
            <p>{totalDonaciones}</p>
          </div>

          <div className="stat-card">
            <h3>Donaciones activas</h3>
            <p>{activas}</p>
          </div>

          <div className="stat-card">
            <h3>Donaciones completadas</h3>
            <p>{completadas}</p>
          </div>
        </section>

        {/* GRAFICAS */}
        <section className="charts">
          <div className="chart-card">
            <h3>Estado de donaciones</h3>
            <Pie data={pieData} />
          </div>

          <div className="chart-card">
            <h3>Donaciones por título</h3>
            <Bar data={barData} />
          </div>
        </section>

        {/* LISTA */}
        <section className="donaciones-section">
          <h2>Últimas donaciones</h2>

          {loading ? (
            <div className="loading">Cargando datos...</div>
          ) : donaciones.length === 0 ? (
            <div className="empty-state">
              <h3>No hay donaciones todavía</h3>
              <p>
                Cuando registres donaciones aparecerán aquí.
              </p>
              <button className="primary-btn">
                Crear primera donación
              </button>
            </div>
          ) : (
            <div className="cards">
              {donaciones.map((d) => (
                <div className="card" key={d.id}>
                  <div className="card-header">
                    <h3>{d.titulo}</h3>
                    <span className={`estado ${d.estado}`}>
                      {d.estado}
                    </span>
                  </div>

                  <p className="descripcion">
                    {d.descripcion}
                  </p>

                  <div className="card-actions">
                    <button
                      onClick={() =>
                        navigate(`/donacion/${d.id}`)
                      }
                      className="ver-btn"
                    >
                      Ver detalles
                    </button>

                    <button className="edit-btn">
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;