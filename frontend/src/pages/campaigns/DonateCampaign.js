import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  getCampaign,
} from "../../services/campaignService";

import {
  createDonation,
} from "../../services/donationService";

import {
  MapPin,
  Users,
  Target,
  DollarSign,
  Heart,
  Plus,
  Trash2,
  Send,
  FileImage,
  MessageSquare,
  Package,
  Sparkles,
  CheckCircle,
  Loader2
} from "lucide-react";

import "./DonateCampaign.css";

function DonateCampaign() {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const token = localStorage.getItem("token");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  let currentUserId = null;

  if (token) {
    const decoded = jwtDecode(token);
    currentUserId = decoded.user_id;
  }

  const [campaign, setCampaign] = useState(null);
  const [moneyAmount, setMoneyAmount] = useState("");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState([
    { name: "", quantity: 1, condition: "good" },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCampaign();
  }, []);

const handleImages = (e) => {
  const files = Array.from(e.target.files);

  setImages((prev) => {
    const combined = [...prev, ...files];

    // evitar duplicados por nombre + size
    const unique = combined.filter(
      (file, index, self) =>
        index === self.findIndex(
          (f) => f.name === file.name && f.size === file.size
        )
    );

    return unique;
  });

  const newPreviews = files.map((file) =>
    URL.createObjectURL(file)
  );

  setImagePreviews((prev) => [...prev, ...newPreviews]);
};

  const loadCampaign = async () => {
    try {
      setLoading(true);
      const res = await getCampaign(id);
      setCampaign(res.data);
    } catch (err) {
      console.error("Error cargando campaña", err);
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { name: "", quantity: 1, condition: "good" }]);
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSending(true);

      const formData = new FormData();

      formData.append("donor_id", currentUserId);
      formData.append("destination_type", "campaign");
      formData.append("campaign_id", id);
      formData.append("money_amount", moneyAmount || "");
      formData.append("notes", notes);
      formData.append("items", JSON.stringify(items));

      images.forEach((img) => {
        formData.append("images", img);
      });

      await createDonation(formData);

      // 👇 transición visual
      setSubmitted(true);

    } catch (err) {
      console.error(err);
      alert("Error al procesar la donación");
    } finally {
      setSending(false);
    }
  };

  if (loading || !campaign)
    return <div className="donate-loading">Cargando campaña...</div>;

  return (
    <div className="donate-page">
      <Navbar />

      {/* 🔥 HERO */}
      <div className="donate-hero">
        <img src={campaign.image} alt={campaign.title} />

        <div className="donate-overlay">
          <h1>{campaign.title}</h1>
          <p>{campaign.description}</p>

          <div className="donate-stats">
            <div><MapPin size={18} /> {campaign.city}</div>
            <div><Users size={18} /> {campaign.total_volunteers}</div>
            <div><Target size={18} /> Meta: {campaign.goal_amount} Bs</div>
            <div><DollarSign size={18} /> Recaudado: {campaign.collected_amount} Bs</div>
          </div>
        </div>
      </div>

      {/* 💰 DONACIÓN */}
      <div className="donate-container">

        {/* 💰 FORMULARIO */}
        {!submitted && (
          <div className="donate-formBox animate-form">
            <h2><Heart size={18} /> Realizar donación</h2>
            
            <form onSubmit={handleSubmit}>

              <label>
                <DollarSign size={16} /> Monto monetario (opcional)
              </label>
              <input
                type="number"
                placeholder="Ej: 50"
                value={moneyAmount}
                onChange={(e) => setMoneyAmount(e.target.value)}
              />

              <label>
                <MessageSquare size={16} /> Notas
              </label>
              <textarea
                placeholder="Mensaje opcional..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <label>
                <FileImage size={16} /> Imágenes de la donación
              </label>

              <label className="file-upload-box">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImages}
                />

                <div className="file-upload-ui">
                  <Plus size={18} />
                  <span>Agregar imágenes</span>
                </div>
              </label>

              {imagePreviews.length > 0 && (
                <div className="img-preview-grid">
                  {imagePreviews.map((img, i) => (
                    <img key={i} src={img} alt="preview" />
                  ))}
                </div>
              )}

              <button
                type="button"
                className="btn-clear-images"
                onClick={() => {
                  setImages([]);
                  setImagePreviews([]);
                }}
              >
                Limpiar imágenes
              </button>

              <h3>
                <Package size={16} /> Artículos a donar
              </h3>

              {items.map((item, index) => (
                <div key={index} className="donate-item">

                  <input
                    placeholder="Nombre del artículo"
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(index, "name", e.target.value)
                    }
                  />

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                  />

                  <select
                    value={item.condition}
                    onChange={(e) =>
                      handleItemChange(index, "condition", e.target.value)
                    }
                  >
                    <option value="new">Nuevo</option>
                    <option value="good">Buen estado</option>
                    <option value="used">Usado</option>
                  </select>

                  <button type="button" onClick={() => removeItem(index)} className="btn-remove">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <button type="button" onClick={addItem} className="btn-add">
                <Plus size={16} /> Agregar item
              </button>

              <button type="submit" className="btn-donate" disabled={sending}>
                {sending ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
                {sending ? "Enviando..." : "Confirmar donación"}
              </button>

            </form>
          </div>
        )}

        {/* 🎉 PANTALLA DE ÉXITO (FIJA, NO DESAPARECE) */}
        {submitted && (
          <div className="donate-success-screen">
            <div className="donate-success animate-success">
              <div className="success-icon">
                <CheckCircle size={48} />
              </div>

              <h2>¡Gracias por tu donación!</h2>
              <p>
                Tu aporte fue registrado correctamente y está en revisión por el equipo.
              </p>

              <button
                className="btn-donate"
                onClick={() => window.location.reload()}
              >
                Recargar página
              </button>
              <button className="btn-activity" onClick={() => navigate("/my-activity")}>
                Mi actividad
              </button>
            </div>
          </div>
        )}

        {/* 📊 RESUMEN */}
        <div className="donate-summary">
          <h3>Resumen</h3>

          <p><strong>Campaña:</strong> {campaign.title}</p>
          <p><strong>Items:</strong> {items.length}</p>
          <p><strong>Monto:</strong> Bs {moneyAmount || 0}</p>

          <div className="summary-box">
            <Sparkles size={16} />
            <span>Tu donación ayuda directamente a esta campaña</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DonateCampaign;