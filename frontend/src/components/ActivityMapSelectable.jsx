import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useState, useEffect } from "react";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "10px",
};

export default function ActivityMapSelectable({ onSelect, initialLat, initialLng, editable = false, }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyD2GCanK5Gxm26zDyPrKc7MNy7WhAJZK7M",
  });

  const [position, setPosition] = useState(null);

useEffect(() => {
  if (initialLat != null && initialLng != null) {
    setPosition({
      lat: Number(initialLat),
      lng: Number(initialLng),
    });
  } else {
    setPosition(null); // 👈 limpia mapa si no hay data
  }
}, [initialLat, initialLng]);

  if (!isLoaded) return <p>Cargando mapa...</p>;

  const handleClick = (e) => {
    if (!editable) return; // 🚫 no permite cambiar

    const pos = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };

    setPosition(pos);

    if (typeof onSelect === "function") {
      onSelect(pos);
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position || { lat: -16.5, lng: -68.15 }}
      zoom={13}
      onClick={handleClick}
    >
      {position && <Marker position={position} />}
    </GoogleMap>
  );
}