    import React, { useEffect, useState } from "react";
    import Navbar from "../../components/Navbar";
    import api from "../../services/api";
    import "./MyActivity.css";

    function MyActivity() {
    const [data, setData] = useState({
        donations: [],
        activities: [],
        });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadActivity();
    }, []);

        const loadActivity = async () => {
        try {
            const res = await api.get("/my-activity/");
            setData(res.data || { donations: [], activities: [] });
        } catch (err) {
            console.error(err);
            setData({ donations: [], activities: [] });
        } finally {
            setLoading(false);
        }
        };
        
    if (loading) return <div className="loading">Cargando actividad...</div>;

    return (
        <div className="activity-page">
            <Navbar />

            <div className="activity-header">
            <h1>Mi actividad</h1>
            </div>

            {/* DONACIONES */}
            <section className="section-container">
            <h2 className="section-title">Mis donaciones</h2>

            <div className="card-grid">
                {data.donations.length === 0 ? (
                <div className="empty">No tienes donaciones aún</div>
                ) : (
                data.donations.map((d) => (
                    <div key={d.id} className="card">
                    <h3>{d.campaign}</h3>

                    <p>
                        Estado: <span className="status">{d.status}</span>
                    </p>

                    <p>Monto: {d.money_amount || 0} Bs</p>
                    <p>Fecha: {new Date(d.created_at).toLocaleString()}</p>

                    <div className="items">
                        {d.items.map((i, idx) => (
                        <span key={idx}>
                            {i.name} x{i.quantity}
                        </span>
                        ))}
                    </div>
                    <div className="actions">
                    <button className="btn secondary">Ver detalle</button>
                    <button className="btn">Ver campaña</button>
                    <button className="btn danger">Comprobante</button>
                    </div>
                    </div>
                ))
                )}
            </div>
            </section>

            {/* ACTIVIDADES */}
            <section className="section-container">
            <h2 className="section-title">Mis postulaciones</h2>

            <div className="card-grid">
                {data.activities.length === 0 ? (
                <div className="empty">No te has postulado a actividades</div>
                ) : (
                data.activities.map((a) => (
                    <div key={a.id} className="card">
                    <h3>{a.activity}</h3>

                    <p>Campaña: {a.campaign}</p>

                    <p>
                        Estado: <span className="status">{a.status}</span>
                    </p>

                    <p>Postulado: {new Date(a.applied_at).toLocaleString()}</p>
                    <div className="actions">
  <button className="btn secondary">Ver actividad</button>
  <button className="btn">Ver campaña</button>
  <button className="btn danger">Cancelar postulación</button>
</div>
                    </div>
                    
                ))
                )}
            </div>
            </section>
        </div>
    );
    }

    export default MyActivity;