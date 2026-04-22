import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { getDonations, updateDonationStatus } from "../../services/donationService";

function IncomigDonations() {
  const [donations, setDonations] = useState([]);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("id_desc");

  const token = localStorage.getItem("token");

  const loadDonations = async () => {
    const res = await getDonations(token);
    const data = res.data;

    setDonations(Array.isArray(data) ? data : data.results || []);
  };

  useEffect(() => {
    loadDonations();
  }, []);

  // =========================
  // FILTROS
  // =========================
  const getProcessed = () => {
    let data = [...donations];

    if (search) {
      data = data.filter(
        (d) =>
          d.status.toLowerCase().includes(search.toLowerCase()) ||
          String(d.id).includes(search)
      );
    }

    if (orderBy === "id_asc") data.sort((a, b) => a.id - b.id);
    if (orderBy === "id_desc") data.sort((a, b) => b.id - a.id);

    return data;
  };

  const processed = getProcessed();

  // =========================
  // ACCIONES
  // =========================
  const changeStatus = async (id, status) => {
    await updateDonationStatus(id, status, `Estado cambiado a ${status}`);
    loadDonations();
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="users-container">

        {/* HEADER */}
        <div className="users-header">
          <div>
            <h1>Donaciones</h1>
            <p className="subtitle">Revisión y aprobación</p>
          </div>
        </div>

        {/* FILTROS */}
        <div className="filters">
          <input
            placeholder="Buscar por ID o estado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select onChange={(e) => setOrderBy(e.target.value)}>
            <option value="id_desc">Más recientes</option>
            <option value="id_asc">Más antiguas</option>
          </select>

          <span style={{ marginLeft: "auto", fontSize: "13px", opacity: 0.7 }}>
            {processed.length} resultados
          </span>
        </div>

        {/* TABLA */}
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Donante</th>
                <th>Destino</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {processed.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.donor}</td>
                  <td>{d.destination_type}</td>
                  <td>{d.money_amount || 0} Bs</td>

                  {/* STATUS BADGE */}
                  <td>
                    <span className={`status ${d.status}`}>
                      {d.status}
                    </span>
                  </td>

                  <td>
                    {new Date(d.created_at).toLocaleDateString()}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="table-actions">

                      {d.status === "pending" && (
                        <>
                          <button
                            className="small-btn edit-small"
                            onClick={() => changeStatus(d.id, "accepted")}
                          >
                            Aceptar
                          </button>

                          <button
                            className="small-btn delete-small"
                            onClick={() => changeStatus(d.id, "rejected")}
                          >
                            Rechazar
                          </button>
                        </>
                      )}

                      {d.status !== "pending" && (
                        <span style={{ fontSize: "12px", opacity: 0.6 }}>
                          Sin acciones
                        </span>
                      )}

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY */}
        {processed.length === 0 && (
          <div className="empty-state">
            <h3>No hay donaciones</h3>
            <p>Cuando los usuarios donen aparecerán aquí</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default IncomigDonations;