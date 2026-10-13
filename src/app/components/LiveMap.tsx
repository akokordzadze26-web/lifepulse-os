"use client";

import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

interface LiveMapProps {
  center: [number, number];
  routePoints: [number, number][];
  isDarkMode: boolean;
}

export default function LiveMap({ center, routePoints, isDarkMode }: LiveMapProps) {
  return (
    <MapContainer 
      center={center} 
      zoom={16} 
      scrollWheelZoom={true} 
      style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
    >
      <ChangeView center={center} />
      
      {/* სრულიად უფასო და სტანდარტული OpenStreetMap ფილები */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={center} icon={icon} />

      {routePoints.length > 1 && (
        <Polyline positions={routePoints} color="#ef4444" weight={5} />
      )}
    </MapContainer>
  );
}