import React, { useState } from "react";
import { createCampaign } from "../../services/campaignService";
import "./Campaigns.css";

export default function CampaignForm({ onSuccess }) {
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
    image: null,
  });

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

    // validar todo antes de enviar
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

    await createCampaign(formData, token);

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="form">
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
      <div className="input-group">
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
      <div className="input-group">
        <label>Imagen (opcional)</label>
        <input type="file" name="image" onChange={handleChange} />
      </div>

      {/* FECHAS */}
      <div className="date-group">
        <div className="input-group">
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

        <div className="input-group">
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
      </div>

      {/* ESTADO */}
      <div className="input-group">
        <label>Estado</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="draft">Borrador</option>
          <option value="active">Activa</option>
          <option value="paused">Pausada</option>
          <option value="finished">Finalizada</option>
        </select>
      </div>

      {/* META */}
      <div className="input-group">
        <label>Descripción de la meta</label>
        <textarea
          name="goal_description"
          value={form.goal_description}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
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

      {/* UBICACIÓN */}
      <div className="input-group">
        <label>Ciudad</label>
        <input name="city" value={form.city} onChange={handleChange} />
      </div>

      <div className="input-group">
        <label>País</label>
        <input name="country" value={form.country} onChange={handleChange} />
      </div>

      {/* BOTONES */}
      <button type="submit" className="primary-btn">
        Crear campaña
      </button>

      <button type="button" onClick={onSuccess} className="cancel-btn">
        Cancelar
      </button>
      </div>
    </form>
  );
}