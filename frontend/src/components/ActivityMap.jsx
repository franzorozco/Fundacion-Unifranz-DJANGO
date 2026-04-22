
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "10px",
};

export default function ActivityMap({ lat, lng }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyD2GCanK5Gxm26zDyPrKc7MNy7WhAJZK7M",
  });

  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (lat && lng) {
      setPosition({
        lat: Number(lat),
        lng: Number(lng),
      });
    }
  }, [lat, lng]);

  if (!isLoaded) return <p>Cargando mapa...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position || { lat: -16.5, lng: -68.15 }}
      zoom={13}
    >
      {position && <Marker position={position} />}
    </GoogleMap>
  );
}