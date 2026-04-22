import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import "./Solicitudes.css";
import { getApplications, updateApplication } from "../../services/volunteerService";
import { CheckCircle, XCircle, Clock, Check } from "lucide-react";
function SolicitudesPage() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const statusLabels = {
    applied: "Postulado",
    approved: "Aprobado",
    rejected: "Rechazado",
    completed: "Completado",
  };
  const statusClass = {
    applied: "status-pending",
    approved: "status-approved",
    rejected: "status-rejected",
    completed: "status-completed",
   };
   const statusIcons = {
    applied: <Clock size={16} />,
    approved: <CheckCircle size={16} />,
    rejected: <XCircle size={16} />,
    completed: <Check size={16} />,
   };
  const loadData = async () => {
    const res = await getApplications();
    setApplications(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatus = async (id, status) => {
    await updateApplication(id, { status });
    loadData();
  };

    const filtered = applications.filter((a) =>
    (a.user?.username || a.user?.email || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="layout">
      <Sidebar />

      <div className="users-container">
        {/* HEADER */}
        <div className="users-header">
          <div>
            <h1>Solicitudes</h1>
            <p className="subtitle">Postulaciones de voluntarios</p>
          </div>
        </div>

        {/* FILTRO */}
        <div className="filters">
          <input
            placeholder="Buscar por usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLA */}
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Actividad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.user?.username || a.user?.email}</td>
                  <td>{a.activity?.title}</td>
                <td>
<span className={`status-badge ${statusClass[a.status]}`}>
  {statusIcons[a.status]}
  <span style={{ marginLeft: "6px" }}>
    {statusLabels[a.status] || a.status}
  </span>
</span>
                </td>

                  <td>
                    <div className="table-actions">

                      <button
                        className="approve-btn"
                        onClick={() => handleStatus(a.id, "approved")}
                      >
                        ✔ Aprobar
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() => handleStatus(a.id, "rejected")}
                      >
                        ✖ Rechazar
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {applications.length === 0 && (
          <div className="empty-state">
            <h3>No hay solicitudes</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default SolicitudesPage;