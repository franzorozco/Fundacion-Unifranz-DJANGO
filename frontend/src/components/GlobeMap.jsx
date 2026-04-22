import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, Html } from "@react-three/drei";
import { useEffect, useState, useMemo } from "react";
import { getActivitiesMap } from "../services/campaignService";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

function Globe() {
  const texture = useLoader(
    THREE.TextureLoader,
    "/textures/earth.jpg"
  );

  return (
    <Sphere args={[2.05, 64, 64]} rotation={[0, Math.PI, 0]}>
      <meshStandardMaterial map={texture} />
    </Sphere>
  );
}

function ActivityPoints({ activities }) {
  const [hovered, setHovered] = useState(null);
  const grouped = useMemo(() => {
    const groups = {};

    activities.forEach((a) => {
      const lat = a?.location?.latitude;
      const lng = a?.location?.longitude;

      if (lat == null || lng == null) return;

      const key = `${lat.toFixed(3)}-${lng.toFixed(3)}`;

      if (!groups[key]) {
        groups[key] = {
          lat,
          lng,
          items: [],
        };
      }

      groups[key].items.push(a);
    });

    return Object.values(groups);
  }, [activities]);

  return grouped.map((group, i) => {
    const { lat, lng, items } = group;
    const isHovered = hovered === i;
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (-lng + 180) * (Math.PI / 180);

    const radius = 2.05;

    const jitter = 0.02;

    const x =
      radius * Math.sin(phi) * Math.cos(theta) +
      (Math.random() - 0.5) * jitter;

    const y =
      radius * Math.cos(phi) +
      (Math.random() - 0.5) * jitter;

    const z =
      radius * Math.sin(phi) * Math.sin(theta) +
      (Math.random() - 0.5) * jitter;

    const labelRadius = 3.2;

    const spread = 0.25;

    const lx =
      labelRadius * Math.sin(phi) * Math.cos(theta) +
      (i % 4) * spread;

    const ly =
      labelRadius * Math.cos(phi) +
      Math.floor(i / 4) * spread;

    const lz =
      labelRadius * Math.sin(phi) * Math.sin(theta);

    
    
    return (
      <group key={i}>

        {/* LINEA */}
        <line>
          
          <bufferGeometry
            attach="geometry"
            onUpdate={(self) => {
              self.setFromPoints([
                new THREE.Vector3(x, y, z),
                new THREE.Vector3(lx, ly, lz),
              ]);
            }}
          />

          <lineBasicMaterial
            attach="material"
            color={isHovered ? "#f43f5e" : "#facc15"}
            transparent
            opacity={isHovered ? 1 : 0.5}
          />
        </line>

        {/* LABEL MULTI-ACTIVIDAD */}
        <Html position={[lx, ly, lz]} center>
          <div
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={() =>
              window.location.href = `/campaigns/${items[0].campaign}/participate`
            }
        style={{
          width: "220px",
          background: isHovered
            ? "linear-gradient(135deg, #0ea5e9, #0284c7)"
            : "linear-gradient(135deg, #ffffff, #f8fafc)",
          color: isHovered ? "white" : "black",
          padding: "14px",
          borderRadius: "14px",
          boxShadow: isHovered
            ? "0 15px 40px rgba(0,0,0,0.5)"
            : "0 8px 25px rgba(0,0,0,0.25)",
          cursor: "pointer",
          transform: isHovered ? "scale(1.15)" : "scale(1)",
          transition: "all 0.25s ease",
          border: isHovered ? "2px solid #38bdf8" : "1px solid #e5e7eb",
        }}

        >
          {/* HEADER */}
          <div style={{ marginBottom: "8px" }}>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                color: "#0f172a",
              }}
            >
              📍 {items[0].location?.city}
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "#64748b",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                }}
              >
                {items[0].campaign?.title}
              </div>
            </div>
          </div>

          {/* LISTA */}
          <div style={{ marginTop: "8px" }}>
            {items.slice(0, 3).map((a, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: "12px",
                  marginBottom: "4px",
                  color: "#334155",
                }}
              >
                • {a.title}
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div
            style={{
              marginTop: "10px",
              fontSize: "11px",
              color: "#0ea5e9",
              fontWeight: "bold",
            }}
          >
            Ver detalles →
          </div>
        </div>
      </Html>
      </group>
    );
  });
}

export default function GlobeMap() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    getActivitiesMap()
      .then((res) => {
        console.log("DATA MAP:", res.data);
        setActivities(res.data);
      })
      .catch((err) => {
        console.error("Error cargando mapa:", err);
      });
  }, []);

  return (
    <div style={{ height: "850px", width: "70%", margin: " 0 auto", }}>
      <Canvas camera={{ position: [-2, -1, -4] }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 5, 5]} />

        <Globe />
        <ActivityPoints activities={activities} />

        <OrbitControls enableZoom />
      </Canvas>
    </div>
  );
}