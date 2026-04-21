import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { jwtDecode } from "jwt-decode";
import { User } from "lucide-react";
import {
  getCampaign,
  getCampaignActivities,
  applyToActivity,
} from "../../services/campaignService";

import {
  MapPin,
  Users,
  Target,
  DollarSign,
  CheckCircle,
  MessageSquare,
  Send,
  Activity,
} from "lucide-react";

import "./CampaignParticipation.css";

function CampaignParticipation() {
  const { id } = useParams();

  const token = localStorage.getItem("token");

    let currentUserId = null;

    if (token) {
    const decoded = jwtDecode(token);
    currentUserId = decoded.user_id; // o "id" según tu backend
    }

    const [campaign, setCampaign] = useState(null);
    const [activities, setActivities] = useState([]);
    const [form, setForm] = useState({ message: "" });
    const [loading, setLoading] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [selectedActivityData, setSelectedActivityData] = useState(null);
    const [toast, setToast] = useState(null);
    const selectedActivityFull = activities.find(
    (a) => a.id === selectedActivity
    );

    const isAlreadyApplied =
    selectedActivityFull?.volunteers?.some(
        (v) => v.user?.id === currentUserId
    ) ?? false;

    const showToast = (message, type = "info") => {
    setToast({ message, type });

    setTimeout(() => {
        setToast(null);
    }, 3000);
    };

    useEffect(() => {
        if (id) loadData();
    }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);

      const res = await getCampaign(id);
      setCampaign(res.data);

      const actRes = await getCampaignActivities(id);

      setActivities(
        actRes.data?.results ? actRes.data.results : actRes.data
      );

    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 POSTULARSE A UNA ACTIVIDAD (NO CAMPAÑA)
const handleApply = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    showToast("Debes iniciar sesión para postularte", "error");
    return;
  }

  if (!selectedActivity)
    return showToast("Selecciona una actividad primero", "warning");

  try {
    await applyToActivity(selectedActivity, {
      message: form.message,
      status: "applied",
    });

    showToast("Postulación enviada correctamente", "success");

    await loadData();

    setForm({ message: "" });
    setSelectedActivity(null);

  } catch (err) {
    if (err?.response?.status === 401) {
      showToast("Sesión expirada, inicia sesión otra vez", "error");
      localStorage.removeItem("token");
      return;
    }

    showToast(
      err?.response?.data?.message || "Error al postularte",
      "error"
    );
  }
};

  if (loading || !campaign)
    return <div className="loading">Cargando campaña...</div>;

  return (
    <div className="cp-page">
      <Navbar />
    {toast && (
        <div className={`cp-toast ${toast.type}`}>
            {toast.message}
        </div>
        )}
      {/* HERO */}
      <div className="cp-hero">
        <img src={campaign.image} alt={campaign.title} />

        <div className="cp-heroOverlay">
          <h1>{campaign.title}</h1>
          <p>{campaign.description}</p>

            <div className="cp-heroStats">
            <div><MapPin size={18} /> {campaign.city}, {campaign.country}</div>
            <div><Users size={18} /> {campaign.total_volunteers} voluntarios</div>
            <div><Target size={18} /> Meta: {campaign.goal_amount} Bs</div>
            <div><DollarSign size={18} /> Recaudado: {campaign.collected_amount} Bs</div>
            </div>
        </div>
      </div>

      {/* PROGRESO */}
      <div className="cp-progress">
        <h2>Progreso de la campaña</h2>

        <div className="cp-progressBar">
          <div
            className="cp-progressFill"
            style={{
              width: `${Math.min(
                (campaign.collected_amount / campaign.goal_amount) * 100,
                100
              )}%`,
            }}
          />
        </div>
      </div>

      {/* ACTIVIDADES */}
      <div className="cp-section">
        <h2>Actividades de la campaña</h2>

        <div className="cp-grid">
          {activities.length === 0 ? (
            <p>No hay actividades registradas.</p>
          ) : (
            activities.map((a) => (
              <div
                key={a.id}
                className={`cp-card ${
                    selectedActivity === a.id ? "is-active pulse" : ""
                }`}
                onClick={() => {
                    setSelectedActivity(a.id);
                    setSelectedActivityData(a);
                }}
              >
                <h3>{a.title}</h3>
                <p>{a.description}</p>

                <div className="cp-meta">
                <span><Users size={14} /> {a.required_volunteers}</span>
                <span><DollarSign size={14} /> {a.reward_points} pts</span>
                <span><Activity size={14} /> {a.status}</span>
                </div>

                                {a.location && (
                                <div className="cp-location">
                                    📍 {a.location.city} - {a.location.address}
                                </div>
                                )}

                                {/* 🟡 indicador de selección */}
                {selectedActivity === a.id && (
                <div className="cp-selected">
                    <CheckCircle size={16} />
                    <span>Actividad seleccionada</span>
                </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

{selectedActivity && selectedActivityData && (
  <div className="cp-form-layout">
    
    {/* FORM */}
    <div className="cp-formBox cp-form-animated">
      <h2>
        <MessageSquare size={18} /> Postularse a actividad
      </h2>

      <form onSubmit={handleApply}>
        <textarea
          placeholder="Mensaje opcional para el coordinador..."
          value={form.message}
          onChange={(e) =>
            setForm({ ...form, message: e.target.value })
          }
        />

        <button
        type="submit"
        disabled={!selectedActivity || isAlreadyApplied}
        className={`cp-btn ${
            isAlreadyApplied ? "cp-btn-disabled" : ""
        }`}
        >
        <Send size={18} />

        {!selectedActivity
            ? "Selecciona una actividad"
            : isAlreadyApplied
            ? "Ya estás postulado"
            : "Confirmar postulación"}
        </button>
      </form>
    </div>

    {/* SKILLS PANEL */}
    <div className="cp-skillsBox">
      <h3>
        <Activity size={18} /> Requisitos de la actividad
      </h3>

      {selectedActivityData.skill_requirements?.length > 0 ? (
        selectedActivityData.skill_requirements.map((s, i) => (
          <div key={i} className="cp-skill-item">
            <div className="cp-skill-name">
              {s.skill?.name}
            </div>

            <div className="cp-skill-level">
              Nivel requerido: {s.required_level}
            </div>

            {s.is_mandatory && (
              <span className="cp-skill-badge">Obligatorio</span>
            )}
          </div>
        ))
      ) : (
        <p className="cp-muted">No hay requisitos definidos</p>
      )}
    </div>

  </div>
)}
      {/* PARTICIPANTES */}
      <div className="cp-section">
        <h2>Participantes por actividad</h2>

        <div className="cp-participants">
          {activities.map((a) =>
            a.volunteers?.map((v, i) => (
              <div key={`${a.id}-${i}`} className="cp-participant">
                <User size={16} />
                {v.user?.username || "Usuario"}
                <span>{v.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CampaignParticipation;