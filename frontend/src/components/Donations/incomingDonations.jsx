import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";

import "./incomingDonations.css";
import { getDonations, updateDonationStatus } from "../../services/donationService";

function IncomigDonations() {
  const [donations, setDonations] = useState([]);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("id_desc");

  const token = localStorage.getItem("token");
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openReview = (donation) => {
  setSelectedDonation(donation);
  setShowModal(true);
  };

  const closeModal = () => {
    setSelectedDonation(null);
    setShowModal(false);
  };

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

                  {/* DONANTE ✔ FIX */}
                  <td>
                    {d.donor?.username} <br />
                    <small style={{ opacity: 0.6 }}>{d.donor?.email}</small>
                  </td>

                  <td>{d.destination_type}</td>
                  <td>{d.money_amount || 0} Bs</td>

                  <td>
                    <span className={`status ${d.status}`}>
                      {d.status}
                    </span>
                  </td>

                  <td>
                    {new Date(d.created_at).toLocaleDateString()}
                  </td>

                  <td>
                    <div className="table-actions">

                      <button
                        className="small-btn"
                        onClick={() => openReview(d)}
                      >
                        Revisar
                      </button>

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

        {showModal && selectedDonation && (
          <div className="modal-overlay" onClick={closeModal}>
            <div
              className="modal-content large-modal"
              onClick={(e) => e.stopPropagation()}
            >

              <h2>Detalle completo de donación</h2>

              {/* ===================== */}
              {/* GENERAL */}
              {/* ===================== */}
              <div className="section">
                <h3>Información general</h3>

                <p><strong>ID:</strong> {selectedDonation.id}</p>
                <p><strong>Estado:</strong> {selectedDonation.status}</p>
                <p><strong>Monto:</strong> {selectedDonation.money_amount || 0} Bs</p>
                <p><strong>Fecha:</strong> {new Date(selectedDonation.created_at).toLocaleString()}</p>
                <p><strong>Notas:</strong> {selectedDonation.notes || "N/A"}</p>
              </div>

              {/* ===================== */}
              {/* DONANTE */}
              {/* ===================== */}
              <div className="section">
                <h3>Donante</h3>

                <p><strong>Nombre:</strong> {selectedDonation.donor?.username}</p>
                <p><strong>Email:</strong> {selectedDonation.donor?.email}</p>
              </div>

              {/* ===================== */}
              {/* CAMPAÑA */}
              {/* ===================== */}
              <div className="section">
                <h3>Campaña</h3>

                {selectedDonation.campaign ? (
                  <>
                    <p><strong>Título:</strong> {selectedDonation.campaign.title}</p>
                    <p><strong>ID:</strong> {selectedDonation.campaign.id}</p>
                  </>
                ) : (
                  <p>Donación a fundación general</p>
                )}
              </div>

              {/* ===================== */}
              {/* ITEMS */}
              {/* ===================== */}
              <div className="section">
                <h3>Items</h3>

                {selectedDonation.items?.length > 0 ? (
                  selectedDonation.items.map((item) => (
                    <div key={item.id} className="item-card">
                      <p><strong>Nombre:</strong> {item.name}</p>
                      <p><strong>Cantidad:</strong> {item.quantity}</p>
                      <p><strong>Estado:</strong> {item.condition}</p>
                      <p><strong>Valor:</strong> {item.estimated_value || 0} Bs</p>
                    </div>
                  ))
                ) : (
                  <p>No hay items</p>
                )}
              </div>

              {/* ===================== */}
              {/* IMÁGENES */}
              {/* ===================== */}
              <div className="section">
                <h3>Imágenes</h3>

                  <div className="images-grid">
                    {selectedDonation.images?.length > 0 ? (
                      selectedDonation.images.map((img) => (
                        <img
                          key={img.id}
                          src={img.image || "/default-image.png"}
                          alt="donación"
                          className="donation-img"
                          onError={(e) => {
                            e.target.src = "/default-image.png";
                          }}
                        />
                      ))
                    ) : (
                      <img
                        src="/default-image.png"
                        alt="sin imágenes"
                        className="donation-img"
                      />
                    )}
                  </div>
              </div>

              {/* ===================== */}
              {/* TRACKING */}
              {/* ===================== */}
              <div className="section">
                <h3>Historial</h3>

                {selectedDonation.tracking?.length > 0 ? (
                  selectedDonation.tracking.map((t) => (
                    <div key={t.id} className="tracking-item">
                      <p><strong>{t.event}</strong></p>
                      <p>{t.description || "Sin descripción"}</p>
                      <small>{new Date(t.created_at).toLocaleString()}</small>
                    </div>
                  ))
                ) : (
                  <p>Sin historial</p>
                )}
              </div>

              {/* BOTÓN */}
              <div style={{ marginTop: "20px" }}>
                <button className="small-btn" onClick={closeModal}>
                  Cerrar
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default IncomigDonations;