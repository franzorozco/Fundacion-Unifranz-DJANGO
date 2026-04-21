import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Users,
  MapPin,
  Heart,
  HandHelping,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import InteractiveBackground from "../../components/InteractiveBackground";
import { getCampaigns } from "../../services/campaignService";
import "./ExploreCampaigns.css";


function ExploreCampaigns() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const res = await getCampaigns();
      let data = res.data;
      data = Array.isArray(data) ? data : data.results || [];

      const visible = data.filter(
        (c) => c.status === "active" && c.is_public
      );

      if (visible.length === 0) {
        setCampaigns([]);
        return;
      }

      const featured = visible.find((c) => c.is_featured);

      const hero =
        featured ||
        [...visible].sort((a, b) => b.priority - a.priority)[0];

      const others = visible
        .filter((c) => c.id !== hero.id)
        .sort((a, b) => b.priority - a.priority);

      setCampaigns([hero, ...others]);

    } catch (error) {
      console.error("Error cargando campañas", error);
    }
  };

  return (
    <div className="explore">
      <InteractiveBackground />
      <Navbar />

      {campaigns.length === 0 ? (
        <div className="empty">No hay campañas disponibles</div>
      ) : (
        <>
          {/* 🔥 HERO */}
          <section
            className="hero"
            style={{
              backgroundImage: `url(${campaigns[0].image || "/default.jpg"})`,
            }}
          >
            <div className="hero-content">
              <span className="badge">Campaña destacada</span>

              <h1>{campaigns[0].title}</h1>

              <p>{campaigns[0].description?.slice(0, 180)}...</p>

              <div className="hero-info">
                <span>
                  <MapPin size={16} /> {campaigns[0].city}
                </span>
                <span>
                  <Users size={16} /> {campaigns[0].total_volunteers}
                </span>
              </div>

              <Link
                to={`/campaigns/${campaigns[0].id}/participate`}
                className="btn-primary"
              >
                <HandHelping size={18} />
                Participar
              </Link>

              <Link to={`/campaigns/${campaigns[0].id}/donate`} className="btn-secondary">
                <Heart size={18} />
                Donar
              </Link>

            </div>
          </section>

          {/* 📦 GRID */}
          <section className="campaigns-section">
            <h2>Explorar campañas</h2>

            <div className="campaign-grid">
              {campaigns.slice(1).map((c) => {
                const progress = c.goal_amount
                  ? (c.collected_amount / c.goal_amount) * 100
                  : 0;

                return (
                  <div className="campaign-card" key={c.id}>
                    <div
                      className="card-image"
                      style={{
                        backgroundImage: `url(${c.image || "/default.jpg"})`,
                      }}
                    />

                    <div className="card-content">
                      <h3>{c.title}</h3>

                      <p>{c.description}</p>

                      <div className="card-bottom">
                        <div className="meta">
                          <span>
                            <MapPin size={14} /> {c.city}
                          </span>
                          <span>
                            <Users size={14} /> {c.total_volunteers}
                          </span>
                        </div>

                        {/* 📊 PROGRESO */}
                        <div className="progress-bar">
                          <div
                            className="progress"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        <div className="progress-info">
                          <span>{Math.round(progress)}%</span>
                          <span>
                            Bs {c.collected_amount} / {c.goal_amount}
                          </span>
                        </div>
                      </div>

<Link
  to={`/campaigns/${c.id}/participate`}
  className="btn-secondary"
>
  <HandHelping size={18} />
  Participar
</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      <footer className="footer">
        <h3>Fundación Solidaria</h3>
        <p>Conectando ayuda con quienes más lo necesitan</p>
      </footer>
    </div>
  );
}

export default ExploreCampaigns;