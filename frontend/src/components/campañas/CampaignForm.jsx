import React, { useState, useEffect } from "react";
import { createCampaign, updateCampaign } from "../../services/campaignService";

export default function CampaignForm({ initialData, onSuccess }) {

const [form, setForm] = useState({
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  status: "draft",
  goal_description: "",
  goal_amount: "",
  city: "",
  country: "Bolivia",
  category: "",
  tags: "",
  is_public: true,
  priority: 1,
  image: null,
});

  // 👇 ESTE ES CLAVE
  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        image: null // no precargues archivo
      });
    }
  }, [initialData]);
  const isEditing = !!initialData;
  const [errors, setErrors] = useState({});

  /* =========================
     VALIDACIONES
  ========================= */
  const validate = (name, value) => {
    let error = "";

    if (name === "title" && value.length < 3) {
      error = "El título debe tener al menos 3 caracteres";
    }

    if (name === "description" && value.length < 10) {
      error = "La descripción debe ser más detallada";
    }

    if (name === "goal_amount") {
      if (isNaN(value)) error = "Solo números";
      else if (value <= 0) error = "Debe ser mayor a 0";
    }

    if (name === "start_date") {
      if (form.end_date && value > form.end_date) {
        error = "La fecha inicio no puede ser mayor al fin";
      }
    }

    if (name === "end_date") {
      if (form.start_date && value < form.start_date) {
        error = "La fecha fin no puede ser menor al inicio";
      }
    }

    return error;
  };

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    let newValue = value;

    if (name === "image") {
      setForm({ ...form, image: files[0] });
      return;
    }

    // evitar letras en números
    if (name === "goal_amount") {
      newValue = value.replace(/[^0-9]/g, "");
    }

    const error = validate(name, newValue);

    setErrors({ ...errors, [name]: error });
    setForm({ ...form, [name]: newValue });
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    Object.keys(form).forEach((key) => {
      const err = validate(key, form[key]);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    let res;

    if (isEditing) {
      res = await updateCampaign(initialData.id, formData, token);
    } else {
      res = await createCampaign(formData, token);
    }

    if (res.error) {
      alert("Error al guardar campaña");
      return;
    }

    onSuccess();
  };

  const categories = [
    "Donaciones",
    "Educación",
    "Salud",
    "Alimentación",
    "Ambiente",
    "Social",
    "Voluntariado",
    "Infraestructura",
    "Tecnología",
    "Emergencias",
    "Niñez",
    "Adultos Mayores",
    "Animales",
    "Vivienda",
  ];

  const tagsList = [
    "niños",
    "educacion",
    "salud",
    "comida",
    "familias",
    "ecologia",
    "ayuda",
    "voluntarios",
    "construccion",
    "donacion",
    "sangre",
    "computadoras",
    "jovenes",
    "adultos",
  ];


return (
    <div className="campaign-form-container">
    <form onSubmit={handleSubmit} className="campaign-form">
      
      <div className="form-scroll">
        
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

          {/* TITULO */}
          <div className="input-group">
            <label>Título de la campaña</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={errors.title ? "input-error" : ""}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          {/* DESCRIPCIÓN */}
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className={errors.description ? "input-error" : ""}
            />
            {errors.description && (
              <span className="error-text">{errors.description}</span>
            )}
          </div>

          {/* IMAGEN */}
          <div className="form-group">
            <label>Imagen (opcional)</label>
            <input type="file" name="image" onChange={handleChange} />
          </div>

          {/* FECHAS */}
        <div className="form-group">
          <label>Fecha inicio</label>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            className={errors.start_date ? "input-error" : ""}
          />
          {errors.start_date && (
            <span className="error-text">{errors.start_date}</span>
          )}
          </div>

          <div className="form-group">
            <label>Fecha fin</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              className={errors.end_date ? "input-error" : ""}
            />
            {errors.end_date && (
              <span className="error-text">{errors.end_date}</span>
            )}
          </div>

          {/* ESTADO */}
          <div className="form-group">
            <label>Estado</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="draft">Borrador</option>
              <option value="active">Activa</option>
              <option value="paused">Pausada</option>
              <option value="finished">Finalizada</option>
            </select>
          </div>

          {/* META */}
          <div className="form-group">
            <label>Descripción de la meta</label>
            <textarea
              name="goal_description"
              value={form.goal_description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Monto objetivo (Bs)</label>
            <input
              name="goal_amount"
              value={form.goal_amount}
              onChange={handleChange}
              className={errors.goal_amount ? "input-error" : ""}
            />
            {errors.goal_amount && (
              <span className="error-text">{errors.goal_amount}</span>
            )}
          </div>
          



          {/* CATEGORÍA */}
<div className="form-group">
  <label>Categoría</label>
  <select name="category" value={form.category} onChange={handleChange}>
    <option value="">Seleccionar categoría</option>
    {categories.map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
  </select>
</div>

          {/* TAGS */}
<div className="form-group">
  <label>Tags</label>
  <select
    multiple
    value={form.tags ? form.tags.split(",") : []}
    onChange={(e) => {
      const selected = Array.from(e.target.selectedOptions).map(
        (opt) => opt.value
      );

      setForm({
        ...form,
        tags: selected.join(","), // 🔥 backend format
      });
    }}
  >
    {tagsList.map((tag) => (
      <option key={tag} value={tag}>
        {tag}
      </option>
    ))}
  </select>
</div>

          {/* VISIBILIDAD */}
          <div className="form-group">
            <label>Pública</label>
            <select name="is_public" value={form.is_public} onChange={handleChange}>
              <option value={true}>Sí</option>
              <option value={false}>No</option>
            </select>
          </div>

          {/* PRIORIDAD */}
          <div className="form-group">
            <label>Prioridad</label>
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option value={1}>1 - Baja</option>
              <option value={2}>2</option>
              <option value={3}>3 - Media</option>
              <option value={4}>4</option>
              <option value={5}>5 - Alta</option>
            </select>
          </div>


          {/* UBICACIÓN */}
          <div className="form-group">
            <label>Ciudad</label>
            <input name="city" value={form.city} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>País</label>
            <input name="country" value={form.country} onChange={handleChange} />
          </div>

          {/* BOTONES */}
            <div className="form-actions">
              <button type="button" onClick={onSuccess} className="cancel-btn">
                Cancelar
              </button>

            <button type="submit" className="primary-btn">
              {initialData ? "Actualizar campaña" : "Crear campaña"}
            </button>
            </div>
          </div>
        </div>
  </form>
  </div>
);
}