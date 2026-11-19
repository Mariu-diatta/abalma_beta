
import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Correction des icônes Leaflet dans React
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function MapClick({ onPositionChange }) {
  useMapEvents({
    click(e) {
      onPositionChange({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng
      });
    }
  });

  return null;
}

export default function MapView({ initialPosition, onChange, styleMap = { height: "400px", width: "50%" } }) {
  const [position, setPosition] = useState(
    initialPosition || {
      latitude: 48.8566,
      longitude: 2.3522
    }
  );

  const handlePositionChange = (coords) => {
    setPosition(coords);
    onChange?.(coords);
  };

  return (
      <div style={{ height: styleMap?.height, width: styleMap?.width, zIndex:0 }}>
      <MapContainer
        center={[position.latitude, position.longitude]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClick onPositionChange={handlePositionChange} />

        <Marker
          position={[position.latitude, position.longitude]}
        >
          <Popup>
            Position de livraison
          </Popup>
        </Marker>

      </MapContainer>

    </div>
  );
}
