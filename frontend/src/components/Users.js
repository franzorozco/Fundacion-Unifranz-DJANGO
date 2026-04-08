import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./Users.css";

import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../services/authService";

function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [profileUser, setProfileUser] = useState(null);


  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [orderBy, setOrderBy] = useState("id_asc");
  const [groupByRole, setGroupByRole] = useState(false);
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    role: "",
  });


  const [profileForm, setProfileForm] = useState({
  telefono: "",
  fecha_nacimiento: "",
  direccion: "",
  bio: "",
  is_active_volunteer: true,
});

const [volunteerForm, setVolunteerForm] = useState({
  experience_level: 1,
  is_available: true,
  available_hours_per_week: 0,
  ciudad: "",
  pais: "",
  lat: "",
  lng: "",
  max_distance_km: 10,
});

const [skillsList, setSkillsList] = useState([]);
const [newSkill, setNewSkill] = useState({
  skill: "",
  level: 50,
  years_experience: 0,
  is_certified: false,
});

const [skillsCatalog, setSkillsCatalog] = useState([]);


const saveProfile = async () => {
  try {
    let payload = {};

    if (profileForm.telefono)
      payload.telefono = profileForm.telefono;

    if (profileForm.fecha_nacimiento)
      payload.fecha_nacimiento = profileForm.fecha_nacimiento;

    if (profileForm.direccion)
      payload.direccion = profileForm.direccion;

    if (profileForm.bio)
      payload.bio = profileForm.bio;

    payload.is_active_volunteer = profileForm.is_active_volunteer;

    let profilePayload = {};

    if (volunteerForm.experience_level !== "")
      profilePayload.experience_level = volunteerForm.experience_level;

    if (volunteerForm.available_hours_per_week !== "")
      profilePayload.available_hours_per_week =
        volunteerForm.available_hours_per_week;

    if (volunteerForm.ciudad)
      profilePayload.ciudad = volunteerForm.ciudad;

    if (volunteerForm.pais)
      profilePayload.pais = volunteerForm.pais;

    if (volunteerForm.lat)
      profilePayload.lat = volunteerForm.lat;

    if (volunteerForm.lng)
      profilePayload.lng = volunteerForm.lng;

    if (volunteerForm.max_distance_km !== "")
      profilePayload.max_distance_km =
        volunteerForm.max_distance_km;

    profilePayload.is_available = volunteerForm.is_available;

    // 👉 solo agregar profile si tiene algo
    if (Object.keys(profilePayload).length > 0) {
      payload.profile = profilePayload;
    }

    // ✅ SKILLS (solo si hay)
    if (skillsList.length > 0) {
      payload.skills = skillsList.map((s) => ({
        skill: parseInt(s.skill),
        level: parseInt(s.level || 0),
        years_experience: parseInt(s.years_experience || 0),
        is_certified: s.is_certified || false,
      }));
    }

    console.log("ENVIANDO:", payload);

    const res = await fetch(
      `http://127.0.0.1:8000/api/users/${profileUser.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(JSON.stringify(data));
      return;
    }

    alert("Perfil actualizado ✅");
    openProfile(profileUser);

  } catch (err) {
    console.error(err);
    alert("Error guardando perfil");
  }
};

const openProfile = async (user) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/users/${user.id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    console.log("PROFILE COMPLETO:", data);

    setProfileUser(data);

    // ✅ USER
    setProfileForm({
      telefono: data.telefono || "",
      fecha_nacimiento: data.fecha_nacimiento || "",
      direccion: data.direccion || "",
      bio: data.bio || "",
      is_active_volunteer: data.is_active_volunteer ?? true,
    });

    // ✅ PROFILE
    if (data.profile) {
      setVolunteerForm({
        experience_level: data.profile.experience_level,
        is_available: data.profile.is_available,
        available_hours_per_week: data.profile.available_hours_per_week,
        ciudad: data.profile.ciudad,
        pais: data.profile.pais,
        lat: data.profile.lat || "",
        lng: data.profile.lng || "",
        max_distance_km: data.profile.max_distance_km,
      });
    }

    // ✅ SKILLS (CORRECTO)
    if (data.skills) {
      setSkillsList(data.skills);
    }

  } catch (error) {
    console.error("Error cargando perfil", error);
  }
};

  const loadSkills = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/skills/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setSkillsCatalog(data.results || data);
  };

  const addSkill = () => {
    const exists = skillsList.some(s => s.skill == newSkill.skill);
    if (exists) {
      alert("Ya agregaste esa skill");
      return;
    }
    if (!newSkill.skill) return;

    setSkillsList([...skillsList, { ...newSkill }]);

    setNewSkill({
      skill: "",
      level: 50,
      years_experience: 0,
      is_certified: false,
    });
  };










  const getProcessedUsers = () => {
    let filtered = Array.isArray(users) ? [...users] : [];

    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.username.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedRole) {
      filtered = filtered.filter(
        (u) => u.role?.id === parseInt(selectedRole)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((u) =>
        statusFilter === "activo" ? u.is_active : !u.is_active
      );
    }

    if (orderBy === "id_asc") {
      filtered.sort((a, b) => a.id - b.id);
    } else if (orderBy === "id_desc") {
      filtered.sort((a, b) => b.id - a.id);
    } else if (orderBy === "name_asc") {
      filtered.sort((a, b) => a.username.localeCompare(b.username));
    }

    return filtered;
  };


  const groupedUsers = () => {
    const data = getProcessedUsers();

    if (!groupByRole) return { Todos: data };

    const groups = {};

    data.forEach((u) => {
      const roleName = u.role?.name || "Sin rol";
      if (!groups[roleName]) groups[roleName] = [];
      groups[roleName].push(u);
    });

    return groups;
  };


  const token = localStorage.getItem("token");

  const loadUsers = async () => {
    const data = await getUsers(token);
    setUsers(data.results || data); 
  };

  useEffect(() => {
    loadUsers();
    loadRoles();
    loadSkills();
  }, []);

  const validateField = (name, value) => {
    let error = "";

    if (name === "email") {
      if (!value) error = "Email obligatorio";
      else if (!/\S+@\S+\.\S+/.test(value)) error = "Email inválido";
    }
    if (name === "role") {
      if (!value) error = "Rol obligatorio";
    }


    if (name === "username") {
        if (!value) error = "Username obligatorio";
        else if (value.includes(" ")) error = "No se permiten espacios";
    }

    if (name === "password" && !editingUser) {
      if (!value) error = "Contraseña obligatoria";
      else if (value.length < 6)
        error = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    validateField(field, value);
  };


const loadRoles = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/roles/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setRoles(data.results || data); // 🔥 FIX
  } catch (error) {
    console.error("Error cargando roles", error);
  }
};

const handleSubmit = async () => {
  const validEmail = validateField("email", form.email);
  const validUsername = validateField("username", form.username);
  const validPassword = validateField("password", form.password);
  const validRole = validateField("role", form.role);

  if (!validEmail || !validUsername || !validRole || (!editingUser && !validPassword)) {
    alert("Corrige los errores del formulario");
    return;
  }

  let payload = {
    email: form.email,
    username: form.username,
    role: parseInt(form.role),
  };

  if (form.password) {
    payload.password = form.password;
  }

  let response;

  if (editingUser) {
    response = await updateUser(editingUser.id, payload, token);
  } else {
    response = await createUser(payload, token);
  }

  console.log("RESPONSE:", response);

  if (response.error || response.detail) {
    console.error(response);
    alert("Error al guardar usuario");
    return;
  }

  closeModal();
  loadUsers();
};

const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar usuario?")) return;
    await deleteUser(id, token);
    loadUsers();
  };

const openCreate = () => {
  setEditingUser(null);
  setForm({ email: "", username: "", password: "", role: "" });
  setErrors({ email: "", username: "", password: "", role: "" });
  setModalOpen(true);
};

const openEdit = (user) => {
  setEditingUser(user);
  setForm({
    email: user.email,
    username: user.username,
    password: "",
    role: user.role?.id || "",
  });
  setErrors({ email: "", username: "", password: "", role: "" });
  setModalOpen(true);
};

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
    setForm({ email: "", username: "", password: "", role: "" });
    setErrors({ email: "", username: "", password: "", role: "" });
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="users-container">
        {/* HEADER */}
        <div className="users-header">
          <div>
            <h1>Usuarios</h1>
            <p className="subtitle">Administración de usuarios</p>
          </div>

          <button className="primary-btn" onClick={openCreate}>
            + Nuevo usuario
          </button>
        </div>
        <div className="filters">
          <input
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select onChange={(e) => setSelectedRole(e.target.value)}>
            <option value="">Todos los roles</option>
            {Array.isArray(roles) &&
              roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <select onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Todos</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>

          <select onChange={(e) => setOrderBy(e.target.value)}>
            <option value="id_asc">ID ↑</option>
            <option value="id_desc">ID ↓</option>
            <option value="name_asc">Nombre A-Z</option>
          </select>

          <label>
            <input
              type="checkbox"
              checked={groupByRole}
              onChange={() => setGroupByRole(!groupByRole)}
            />
            Agrupar por rol
          </label>
        </div>

        {/* TABLA */}
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(groupedUsers()).map(([group, usersList]) => (
                <React.Fragment key={group}>
                  {groupByRole && (
                    <tr className="group-header">
                      <td colSpan="6">{group}</td>
                    </tr>
                  )}

                  {usersList.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.email}</td>
                      <td>{u.username}</td>
                      <td>{u.role?.name || "-"}</td>
                      <td>{u.is_active ? "Activo" : "Inactivo"}</td>
                      <td>
                        
                        <div className="table-actions">
                          <button
                            className="small-btn"
                            onClick={() => openProfile(u)}
                          >
                            Ver perfil
                          </button>

                          <button
                            className="small-btn edit-small"
                            onClick={() => openEdit(u)}
                          >
                            Editar
                          </button>

                          <button
                            className="small-btn delete-small"
                            onClick={() => handleDelete(u.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY */}
        {users.length === 0 && (
          <div className="empty-state">
            <h3>No hay usuarios</h3>
            <p>Crea el primero 🚀</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingUser ? "Editar usuario" : "Crear usuario"}</h3>

            <div className="form-group">
  <label>Email</label>
  <input
    type="email"
    value={form.email}
    onChange={(e) => handleChange("email", e.target.value)}
  />
  {errors.email && <p className="form-error">{errors.email}</p>}
</div>

<div className="form-group">
  <label>Nombre de usuario</label>
  <input
    value={form.username}
    onChange={(e) => handleChange("username", e.target.value)}
  />
  {errors.username && <p className="form-error">{errors.username}</p>}
</div>

<div className="form-group">
  <label>Contraseña</label>
  <input
    type="password"
    value={form.password}
    onChange={(e) => handleChange("password", e.target.value)}
  />
  {errors.password && <p className="form-error">{errors.password}</p>}
</div>

<div className="form-group">
  <label>Rol</label>
  <select
    value={form.role || ""}
    onChange={(e) => handleChange("role", e.target.value)}
  >
    <option value="">Selecciona un rol</option>
    {roles.map((r) => (
      <option key={r.id} value={r.id}>
        {r.name}
      </option>
    ))}
  </select>
  {errors.role && <p className="form-error">{errors.role}</p>}
</div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeModal}>
                Cancelar
              </button>

              <button className="primary-btn" onClick={handleSubmit}>
                {editingUser ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>


      )}


{/* PERFIL EDITABLE */}
{profileUser && (
  <div className="modal-overlay full">
    <div className="full-modal">
      {/* HEADER */}
      <div className="modal-header">
        <h2>Perfil de {profileUser.username}</h2>
        <button className="cancel-btn" onClick={() => setProfileUser(null)}>
          ✕
        </button>
      </div>

      {/* CONTENT */}
      <div className="full-modal-content grid-3">
        {/* DATOS DEL USUARIO */}
        <div className="profile-section">
          <h3>Datos del usuario</h3>
          <div className="profile-grid">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profileUser.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Nombre de usuario</label>
              <input
                value={profileForm.username}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, username: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                value={profileForm.telefono}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, telefono: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Fecha de nacimiento</label>
              <input
                type="date"
                value={profileForm.fecha_nacimiento}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, fecha_nacimiento: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Dirección</label>
              <input
                value={profileForm.direccion}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, direccion: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Biografía</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, bio: e.target.value })
                }
              />
            </div>

            <label>
              <input
                type="checkbox"
                checked={profileForm.is_active_volunteer}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    is_active_volunteer: e.target.checked,
                  })
                }
              />
              Voluntario activo
            </label>
          </div>
        </div>

        {/* PERFIL DE VOLUNTARIO */}
        <div className="profile-section">
          <h3>Perfil de voluntario</h3>
          <div className="profile-grid">
            <div className="form-group">
              <label>Nivel de experiencia (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={volunteerForm.experience_level}
                onChange={(e) =>
                  setVolunteerForm({
                    ...volunteerForm,
                    experience_level: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Horas disponibles / semana</label>
              <input
                type="number"
                value={volunteerForm.available_hours_per_week}
                onChange={(e) =>
                  setVolunteerForm({
                    ...volunteerForm,
                    available_hours_per_week: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Ciudad</label>
              <input
                value={volunteerForm.ciudad}
                onChange={(e) =>
                  setVolunteerForm({ ...volunteerForm, ciudad: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>País</label>
              <input
                value={volunteerForm.pais}
                onChange={(e) =>
                  setVolunteerForm({ ...volunteerForm, pais: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Latitud</label>
              <input
                value={volunteerForm.lat}
                onChange={(e) =>
                  setVolunteerForm({ ...volunteerForm, lat: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Longitud</label>
              <input
                value={volunteerForm.lng}
                onChange={(e) =>
                  setVolunteerForm({ ...volunteerForm, lng: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Distancia máxima (km)</label>
              <input
                type="number"
                value={volunteerForm.max_distance_km}
                onChange={(e) =>
                  setVolunteerForm({
                    ...volunteerForm,
                    max_distance_km: e.target.value,
                  })
                }
              />
            </div>

            <label>
              <input
                type="checkbox"
                checked={volunteerForm.is_available}
                onChange={(e) =>
                  setVolunteerForm({ ...volunteerForm, is_available: e.target.checked })
                }
              />
              Disponible
            </label>
          </div>
        </div>

        {/* HABILIDADES */}
        <div className="profile-section">
          <h3>Habilidades</h3>
          <div className="profile-grid">
            <div className="form-group">
              <label>Habilidad</label>
              <select
                value={newSkill.skill}
                onChange={(e) => setNewSkill({ ...newSkill, skill: e.target.value })}
              >
                <option value="">Seleccionar</option>
                {skillsCatalog.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Nivel (%)</label>
              <input
                type="number"
                value={newSkill.level}
                onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Años de experiencia</label>
              <input
                type="number"
                value={newSkill.years_experience}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, years_experience: e.target.value })
                }
              />
            </div>
          </div>

          <label>
            <input
              type="checkbox"
              checked={newSkill.is_certified}
              onChange={(e) =>
                setNewSkill({ ...newSkill, is_certified: e.target.checked })
              }
            />
            Certificado
          </label>
          <button className="primary-btn" onClick={addSkill}>
            + Agregar habilidad
          </button>

          <div className="skills-list">
            {skillsList.map((s, index) => (
              <div key={index} className="skill-item">
                <span>
                  {skillsCatalog.find((x) => x.id == s.skill)?.name} - {s.level}%
                </span>
                <button
                  onClick={() => {
                    const updated = skillsList.filter((_, i) => i !== index);
                    setSkillsList(updated);
                  }}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="modal-footer">
        <button className="cancel-btn" onClick={() => setProfileUser(null)}>
          Cancelar
        </button>
        <button className="primary-btn" onClick={saveProfile}>
          Guardar cambios
        </button>
      </div>
    </div>
  </div>
)}
    </div>

  );

}

export default Users;