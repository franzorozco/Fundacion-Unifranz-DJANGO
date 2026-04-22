import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import CampaignForm from "./CampaignForm";
import ActivityMap from "../ActivityMap";
import "./Campaigns.css";
import ActivityMapSelectable from "../ActivityMapSelectable";
import { getSkills } from "../../services/skillService";
import EventForm from "../EventForm";
import SkillsForm from "../SkillsForm";
import {
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from "../../services/campaignService";

import {
  ListChecks,
  Pencil,
  Trash2,
  MapPin,
  Building2,
  Globe,
  Eye
} from "lucide-react";

import {
  getActivitiesByCampaign
} from "../../services/campaignActivityService";

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

  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);

  const token = localStorage.getItem("token");
  const [eventsModalOpen, setEventsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [activities, setActivities] = useState([]);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);

  const [editSkillsModal, setEditSkillsModal] = useState(false);

  const [locationForm, setLocationForm] = useState({
    address: "",
    city: "",
    country: "Bolivia",
    latitude: null,
    longitude: null,
  });

    /* ---------------- LOAD ---------------- */
  const loadCampaigns = async () => {
    const res = await getCampaigns();

    console.log("RESPONSE:", res); // debug

    const data = res.data;

    setCampaigns(Array.isArray(data) ? data : data.results || []);
  };


  const openEventsModal = async (campaign) => {
    setSelectedCampaign(campaign);

    const data = await getActivitiesByCampaign(campaign.id);
    setActivities(data);

    setEventsModalOpen(true);
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
  useEffect(() => {
  const fetchSkills = async () => {
    const data = await getSkills(token);
    setAvailableSkills(data);
  };

  fetchSkills();
}, []);

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
                    <img
                      src={c.image || "/default-image.png"}
                      alt="campaign"
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                      onError={(e) => {
                        e.target.src = "/default-image.png";
                      }}
                    />
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
                        className="small-btn"
                        onClick={() => openEventsModal(c)}
                      >
                        <Eye size={16} /> Eventos
                      </button>

                      <button
                        className="small-btn edit-small"
                        onClick={() => openEdit(c)}
                      >
                        <Pencil size={16} /> Editar
                      </button>

                      <button
                        className="small-btn delete-small"
                        onClick={() => handleDelete(c.id)}
                      >
                        <Trash2 size={16} /> Eliminar
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

      {eventsModalOpen && (
        <div className="modal-overlay" onClick={() => setEventsModalOpen(false)}>
          <div className="modal large" onClick={(e) => e.stopPropagation()}>

            <h2>Eventos de: {selectedCampaign?.title}</h2>

            {activities.length === 0 ? (
              <p>No hay eventos en esta campaña</p>
            ) : (
              activities.map((a) => (
                <div key={a.id} className="event-card">

                  <h3>{a.title}</h3>
                  <p>{a.description}</p>

                  {/* STATUS */}
                  <p><b>Estado:</b> {a.status}</p>

                  {/* UBICACIÓN */}
                  {a.location ? (
                    <div className="location-box">

                      <p>
                        <MapPin size={14} /> {a.location.address}
                      </p>

                      <p>
                        <Building2 size={14} /> {a.location.city}
                      </p>

                      <p>
                        <Globe size={14} /> {a.location.country}
                      </p>

                      {/* 🗺️ MAPA REAL */}
                      {a.location.latitude && a.location.longitude && (
                        <div style={{ marginTop: "10px" }}>
                          <ActivityMap
                            key={`${a.id}-${a.location.latitude}-${a.location.longitude}`}
                            lat={a.location.latitude}
                            lng={a.location.longitude}
                          />
                        </div>
                      )}
                      <button
                        className="small-btn"
                        onClick={() => {
                          setSelectedActivity(a);
                          setLocationForm({
                            address: a.location?.address || "",
                            city: a.location?.city || "",
                            country: a.location?.country || "Bolivia",
                            latitude: a.location?.latitude || null,
                            longitude: a.location?.longitude || null,
                          });
                          setLocationModalOpen(true);
                        }}
                      >
                        <MapPin size={16} /> Ubicación
                      </button>
                      <button
                        className="edit-skills-btn"
                        onClick={() => {
                          setSelectedActivity(a);

                          setSkills(
                            (a.skill_requirements || []).map(s => ({
                              skill_id: s.skill,
                              required_level: s.required_level,
                              is_mandatory: s.is_mandatory
                            }))
                          );

                          setEditSkillsModal(true);
                        }}
                      >
                        ✏️ Skills
                      </button>
                    </div>
                  
                  ) : (
                    <p className="no-location">Sin ubicación</p>
                  )}
                </div>
              ))
            )}
            <button
              className="primary-btn"
              style={{ marginTop: "20px" }}
              onClick={() => {
                setSelectedActivity(null);
                setCreateEventModalOpen(true);
              }}
            >
              + Agregar evento
            </button>
          </div>
        </div>
      )}
      
      {locationModalOpen && (
              <div className="modal-overlay" onClick={() => setLocationModalOpen(false)}>
                <div className="modal large" onClick={(e) => e.stopPropagation()}>

                  <h2>Editar ubicación</h2>

                  {/* FORM */}
                  <div className="location-form">

                    <input
                      placeholder="Dirección"
                      value={locationForm.address}
                      onChange={(e) =>
                        setLocationForm({ ...locationForm, address: e.target.value })
                      }
                    />

                    <input
                      placeholder="Ciudad"
                      value={locationForm.city}
                      onChange={(e) =>
                        setLocationForm({ ...locationForm, city: e.target.value })
                      }
                    />

                    <input
                      placeholder="País"
                      value={locationForm.country}
                      onChange={(e) =>
                        setLocationForm({ ...locationForm, country: e.target.value })
                      }
                    />

                  </div>

                  {/* MAPA SELECTOR */}
                    <ActivityMapSelectable
                      key={selectedActivity?.id}   // 👈 IMPORTANTE
                      initialLat={locationForm.latitude}
                      initialLng={locationForm.longitude}
                      editable={true}
                      onSelect={(pos) =>
                        setLocationForm({
                          ...locationForm,
                          latitude: pos.lat,
                          longitude: pos.lng,
                        })
                      }
                    />



                  <button
                    className="primary-btn"
                    onClick={async () => {
                      await fetch(
                        `http://127.0.0.1:8000/api/activities/${selectedActivity.id}/location/`,
                        {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify(locationForm),
                        }
                      );

                      setLocationModalOpen(false);
                      openEventsModal(selectedCampaign);
                    }}
                  >
                    Guardar ubicación
                  </button>

                </div>



              </div>
      )}

      {editSkillsModal && (
        <div className="modal-overlay" onClick={() => setEditSkillsModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>

            <h2 >Editar Skills</h2>

            <SkillsForm value={skills} onChange={setSkills} />

            <button
              className="primary-btn"
              onClick={async () => {
                await fetch(
                  `http://127.0.0.1:8000/api/activities/${selectedActivity.id}/skills/`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      skills: skills
                    }),
                  }
                );

                setEditSkillsModal(false);
                openEventsModal(selectedCampaign); // refrescar
              }}
            >
              Guardar skills
            </button>

          </div>
        </div>
      )}

      {createEventModalOpen && (
          <div className="modal-overlay" onClick={() => setCreateEventModalOpen(false)}>
            <div className="modal large" onClick={(e) => e.stopPropagation()}>

              <h2>Crear evento</h2>

              <EventForm
                campaign={selectedCampaign}
                onClose={() => {
                  setCreateEventModalOpen(false);
                  openEventsModal(selectedCampaign); // refrescar lista
                }}
              />

            </div>
          </div>
      )}

    </div>
  );
}

export default Campaigns;