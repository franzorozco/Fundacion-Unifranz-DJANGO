import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import CampaignForm from "./CampaignForm";
import "./Campaigns.css";
import {
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from "../../services/campaignService";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    goal: "",
    status: "active",
  });

  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("id_asc");

  const token = localStorage.getItem("token");

  /* ---------------- LOAD ---------------- */
const loadCampaigns = async () => {
  const res = await getCampaigns();

  console.log("RESPONSE:", res); // debug

  const data = res.data;

  setCampaigns(Array.isArray(data) ? data : data.results || []);
};

  useEffect(() => {
    loadCampaigns();
  }, []);

  /* ---------------- FILTROS ---------------- */
  const getProcessed = () => {
    let data = [...campaigns];

    if (search) {
      data = data.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (orderBy === "id_asc") data.sort((a, b) => a.id - b.id);
    if (orderBy === "id_desc") data.sort((a, b) => b.id - a.id);
    if (orderBy === "title_asc")
      data.sort((a, b) => a.title.localeCompare(b.title));
    if (orderBy === "title_desc")
      data.sort((a, b) => b.title.localeCompare(a.title));

    return data;
  };

  /* ---------------- FORM ---------------- */
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    let res;

    if (editing) {
      res = await updateCampaign(editing.id, form, token);
    } else {
      res = await createCampaign(form, token);
    }

    if (res.error) {
      alert("Error al guardar campaña");
      return;
    }

    closeModal();
    loadCampaigns();
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar campaña?")) return;
    await deleteCampaign(id, token);
    loadCampaigns();
  };

  /* ---------------- MODAL ---------------- */
  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      goal: "",
      status: "active",
    });
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm(c);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="users-container">
        {/* HEADER */}
        <div className="users-header">
          <div>
            <h1>Campañas</h1>
            <p className="subtitle">Administración de campañas</p>
          </div>
          <button className="primary-btn" onClick={openCreate}>
            + Nueva campaña
          </button>
        </div>

        {/* FILTROS */}
        <div className="filters">
          <input
            placeholder="Buscar campaña..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select onChange={(e) => setOrderBy(e.target.value)}>
            <option value="id_asc">ID ↑</option>
            <option value="id_desc">ID ↓</option>
            <option value="title_asc">Título A-Z</option>
            <option value="title_desc">Título Z-A</option>
          </select>

          <span style={{ marginLeft: "auto", fontSize: "13px", opacity: 0.7 }}>
            {getProcessed().length} resultados
          </span>
        </div>

        {/* TABLA */}
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Título</th>
                <th>Progreso</th>
                <th>Voluntarios</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {getProcessed().map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>
                    {c.image && (
                      <img src={c.image} alt="" style={{ width: "50px", height: "50px" }} />
                    )}
                  </td>

                  <td>{c.title}</td>

                  <td>
                    {c.goal_amount
                      ? `${Math.round((c.collected_amount / c.goal_amount) * 100)}%`
                      : "-"}
                  </td>

                  <td>{c.total_volunteers}</td>

                  <td>{c.status}</td>

                  <td>{c.priority}</td>

                  <td>
                    <div className="table-actions">
                      <button
                        className="small-btn edit-small"
                        onClick={() => openEdit(c)}
                      >
                        Editar
                      </button>

                      <button
                        className="small-btn delete-small"
                        onClick={() => handleDelete(c.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY */}
        {campaigns.length === 0 && (
          <div className="empty-state">
            <h3>No hay campañas</h3>
            <p>Crea la primera</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          

          <div onClick={(e) => e.stopPropagation()} className="modal">
            <h3>{editing ? "Editar campaña" : "Crear campaña"}</h3>

            <CampaignForm
              initialData={editing}
              onSuccess={() => {
                closeModal();
                loadCampaigns();
              }}
            />
          </div>

        </div>
      )}
    </div>
  );
}

export default Campaigns;