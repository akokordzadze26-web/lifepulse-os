"use client";

import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapFitnessProps {
  center: [number, number];
  positions: [number, number][];
}

export default function MapFitness({ center, positions }: MapFitnessProps) {
  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const currentPosition = positions.length > 0 ? positions[positions.length - 1] : center;

  return (
    <MapContainer
      key={`${currentPosition[0]}-${currentPosition[1]}`}
      center={currentPosition}
      zoom={17}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url={tileUrl}
      />
      {positions && positions.length > 1 && (
        <Polyline positions={positions} color="#10b981" weight={6} />
      )}
      <Marker position={currentPosition}>
        <Popup>თქვენი რეალური მდებარეობა 📍</Popup>
      </Marker>
    </MapContainer>
  );
}