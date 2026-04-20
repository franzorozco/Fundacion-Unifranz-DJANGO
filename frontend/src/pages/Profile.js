import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import toast, { Toaster } from "react-hot-toast";
import "./Profile.css";
import InteractiveBackground from "../components/InteractiveBackground";


function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [typingField, setTypingField] = useState(null);

  const token = localStorage.getItem("token");

  const loadProfile = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/users/me/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setUser(data);
    setForm(data);
  };

  const handleNestedChange = (section, field, value) => {
    setForm({
      ...form,
      [section]: {
        ...form[section],
        [field]: value,
      },
    });
  };


  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (field, value) => {
    setTypingField(field);

    setForm({ ...form, [field]: value });

    setTimeout(() => setTypingField(null), 300);
  };

const handleSave = async () => {
  const payload = {
    bio: form.bio,
    telefono: form.telefono,
    direccion: form.direccion,
    fecha_nacimiento: form.fecha_nacimiento,
    profile: {
      ciudad: form.profile?.ciudad,
      pais: form.profile?.pais,
      experience_level: form.profile?.experience_level,
      available_hours_per_week: form.profile?.available_hours_per_week
    }
  };

  // role solo si cambias, y solo ID
  if (form.role?.id) payload.role = form.role.id;

  // solo envía profile_image si cambiaste
  if (form.profile_image) payload.profile_image = form.profile_image;

  const res = await fetch("http://127.0.0.1:8000/api/users/me/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    toast.error("Error al actualizar: " + JSON.stringify(data));
    return;
  }

  setUser(data);
  setEditing(false);
  toast.success("Perfil actualizado");
};
  const triggerClickEffect = (e) => {
  const el = document.createElement("span");

  el.className = "click-effect";
  el.style.left = e.clientX + "px";
  el.style.top = e.clientY + "px";

  document.body.appendChild(el);

  setTimeout(() => el.remove(), 600);
};

  if (!user) return <p>Cargando...</p>;

  return (
    <div className="profile-page">
      <InteractiveBackground />
      <Navbar />
      <Toaster />

      <motion.div
        className="profile-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* HEADER */}
        <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15}>
          <motion.div
            className="profile-header"
            whileHover={{ scale: 1.02 }}
          >
<div className="avatar">
  {user.profile_image ? (
    <img src={user.profile_image} alt="profile" />
  ) : (
    user.username?.charAt(0).toUpperCase()
  )}
</div>

            <div>
              <h2>{user.username}</h2>
              <p>{user.email}</p>
              <span className="role-badge">{user.role?.name}</span>
              <p className="status">
                {user.is_active ? "Activo" : "Inactivo"} |{" "}
                {user.is_verified ? "Verificado" : "No verificado"}
              </p>
            </div>
          </motion.div>
        </Tilt>

        {/* BIO */}
        <AnimatedCard title="Biografía">
          {editing ? (
            <textarea
              value={form.bio || ""}
              onChange={(e) => handleChange("bio", e.target.value)}
              className={typingField === "bio" ? "typing" : ""}
            />
          ) : (
            <p>{user.bio || "Sin biografía aún"}</p>
          )}
        </AnimatedCard>

        {/* INFO */}
        <AnimatedCard title="Información personal">
          <div className="grid">
            <Input
              label="Teléfono"
              value={form.telefono}
              editing={editing}
              onChange={(v) => handleChange("telefono", v)}
              active={typingField === "telefono"}
            />

            <Input
              label="Dirección"
              value={form.direccion}
              editing={editing}
              onChange={(v) => handleChange("direccion", v)}
              active={typingField === "direccion"}
            />
            <Input
              label="Fecha de nacimiento"
              value={form.fecha_nacimiento}
              editing={editing}
              onChange={(v) => handleChange("fecha_nacimiento", v)}
            />

          </div>
        </AnimatedCard>

{/* SKILLS */}
<AnimatedCard title="Habilidades">
  {form.skills?.length > 0 ? (
    <div className="skills-list">
      {form.skills.map((s, i) => (
        <motion.div
          key={i}
          className="skill-item"
          whileHover={{
            scale: 1.08,
            boxShadow: "0 10px 25px rgba(59,170,216,0.3)"
          }}
        >
          <strong>{s.skill?.name}</strong>
          <span>Nivel: {s.level}% | {s.years_experience} años {s.is_certified ? "| Certificado" : ""}</span>
        </motion.div>
      ))}
    </div>
  ) : (
    <p>No tienes habilidades registradas</p>
  )}
</AnimatedCard>

{/* PERFIL DE VOLUNTARIO */}
<AnimatedCard title="Perfil de voluntario">
  <div className="grid">

    {/* Ciudad */}
    <div className="input-group">
      <label>Ciudad</label>
      <select
        value={form.profile?.ciudad || ""}
        disabled={!editing}
        onChange={(e) => handleNestedChange("profile", "ciudad", e.target.value)}
      >
        <option value="">Selecciona una ciudad</option>
        <option value="La Paz">La Paz</option>
        <option value="Santa Cruz">Santa Cruz</option>
        <option value="Cochabamba">Cochabamba</option>
        <option value="Sucre">Sucre</option>
        <option value="Oruro">Oruro</option>
        <option value="Potosí">Potosí</option>
        <option value="Tarija">Tarija</option>
        <option value="Trinidad">Trinidad</option>
        <option value="Cobija">Cobija</option>
      </select>
    </div>

    {/* País */}
    <div className="input-group">
      <label>País</label>
      <input
        type="text"
        value="Bolivia"
        disabled
      />
    </div>

    {/* Experiencia */}
    <div className="input-group">
      <label>Experiencia (1-5)</label>
      <input
        type="number"
        min="1"
        max="5"
        value={form.profile?.experience_level || ""}
        disabled={!editing}
        onChange={(e) => {
          const val = Math.max(1, Math.min(5, Number(e.target.value)));
          handleNestedChange("profile", "experience_level", val);
        }}
      />
      {editing && form.profile?.experience_level && (form.profile.experience_level < 1 || form.profile.experience_level > 5) && (
        <span className="error-text">Debe ser un valor entre 1 y 5</span>
      )}
    </div>

    {/* Horas disponibles por semana */}
    <div className="input-group">
      <label>Horas por semana</label>
      <input
        type="number"
        min="0"
        max="168"
        value={form.profile?.available_hours_per_week || ""}
        disabled={!editing}
        onChange={(e) => {
          const val = Math.max(0, Math.min(168, Number(e.target.value)));
          handleNestedChange("profile", "available_hours_per_week", val);
        }}
      />
      {editing && form.profile?.available_hours_per_week && (form.profile.available_hours_per_week < 0 || form.profile.available_hours_per_week > 168) && (
        <span className="error-text">Debe ser entre 0 y 168 horas</span>
      )}
    </div>

    {/* Fecha de nacimiento */}
    <div className="input-group">
      <label>Fecha de nacimiento</label>
      <input
        type="date"
        max={new Date().toISOString().split("T")[0]}
        value={form.fecha_nacimiento || ""}
        disabled={!editing}
        onChange={(e) => handleChange("fecha_nacimiento", e.target.value)}
      />
      {editing && form.fecha_nacimiento && new Date(form.fecha_nacimiento) > new Date() && (
        <span className="error-text">No puede ser mayor a la fecha actual</span>
      )}
    </div>

  </div>
</AnimatedCard>

        {/* BOTONES */}
        <motion.div className="profile-actions">
          {editing ? (
            <>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="primary-btn"
                onClick={(e) => {
                  triggerClickEffect(e);
                  handleSave();
                }}
              >
                Guardar
              </motion.button>

              <button
                className="cancel-btn"
                onClick={() => setEditing(false)}
              >
                Cancelar
              </button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="primary-btn"
              onClick={() => setEditing(true)}
            >
              Editar perfil
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* COMPONENTES REUTILIZABLES */

const AnimatedCard = ({ title, children }) => (
  <motion.div
    className="profile-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{
      y: -5,
      boxShadow: "0 20px 40px rgba(59,170,216,0.2)"
    }}
  > 
    <h3>{title}</h3>
    {children}
  </motion.div>
);

const Input = ({ label, value, editing, onChange, active }) => (
  <div className={`input-group ${active ? "active" : ""}`}>
    <label>{label}</label>
    <input
      value={value || ""}
      disabled={!editing}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);


export default Profile;