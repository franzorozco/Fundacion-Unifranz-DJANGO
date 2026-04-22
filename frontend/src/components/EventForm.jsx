import { useEffect, useState } from "react";
import ActivityMapSelectable from "./ActivityMapSelectable";
import { getSkills } from "../services/skillService";
import SkillsForm from "./SkillsForm";


export default function EventForm({ campaign, onClose }) {

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
    required_volunteers: 1,
    min_age: "",
    max_age: "",
    reward_points: 0,
    priority: 1,
    is_urgent: false,
    requires_transport: false,
  });

  const [location, setLocation] = useState({
    address: "",
    city: "",
    country: "Bolivia",
    latitude: null,
    longitude: null,
  });

  const token = localStorage.getItem("token");
  const [skills, setSkills] = useState([]);



  
  // 🌍 REVERSE GEOCODING (auto dirección)                          
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyD2GCanK5Gxm26zDyPrKc7MNy7WhAJZK7M`
      );

      const data = await res.json();

      if (data.results.length > 0) {
        const result = data.results[0];

        setLocation((prev) => ({
          ...prev,
          address: result.formatted_address,
          latitude: lat,
          longitude: lng,
        }));
      }
    } catch (err) {
      console.error("Error obteniendo dirección", err);
    }
  };

  const handleMapSelect = (pos) => {
    getAddressFromCoords(pos.lat, pos.lng);
  };

  const handleSubmit = async () => {
    // 1️⃣ crear actividad
    const res = await fetch("http://127.0.0.1:8000/api/activities/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        campaign: campaign.id,
        skills: skills, // 🔥 AQUI ESTA LA CLAVE
      }),
    });

    const activity = await res.json();
    console.log("RESPUESTA BACK:", activity);

    // 2️⃣ crear ubicación
    await fetch(`http://127.0.0.1:8000/api/activities/${activity.id}/location/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(location),
    });

    onClose();
  };

  return (
    <div>

      {/* DATOS */}
      <input
        placeholder="Título"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        placeholder="Descripción"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        type="number"
        placeholder="Voluntarios requeridos"
        value={form.required_volunteers}
        onChange={(e) =>
          setForm({ ...form, required_volunteers: e.target.value })
        }
      />

      {/* MAPA */}
      <h3>Ubicación</h3>

      <ActivityMapSelectable
        editable={true}
        onSelect={handleMapSelect}
        initialLat={location.latitude}
        initialLng={location.longitude}
      />

      <input
        placeholder="Dirección"
        value={location.address}
        readOnly
      />

      <input
        placeholder="Ciudad"
        value={location.city}
        onChange={(e) =>
          setLocation({ ...location, city: e.target.value })
        }
      />

      <h3>Requisitos (Skills)</h3>

      <SkillsForm value={skills} onChange={setSkills} />

      {/* BOTÓN */}
      <button className="primary-btn" onClick={handleSubmit}>
        Crear evento
      </button>

    </div>
  );
}