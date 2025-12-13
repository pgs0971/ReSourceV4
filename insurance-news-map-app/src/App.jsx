import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default Leaflet icon paths for Vite/Netlify
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const lossIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

const maIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32],
});

export default function NewsMap({ articles }) {
  const points = articles
    .filter(a => Number.isFinite(a.lat) && Number.isFinite(a.lng))
    .map(a => [a.lat, a.lng]);

  const bounds = points.length ? points : [[20, 0]];

  return (
    <div className="panel">
      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: [30, 30] }}
        style={{ height: "600px", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {articles.map(a => (
          <Marker
            key={a.id}
            position={[a.lat, a.lng]}
            icon={a.category === "Major Loss" ? lossIcon : maIcon}
          >
            <Popup>
              <strong>{a.title}</strong>
              <div style={{ fontSize: 12, marginTop: 6 }}>
                {a.category} • {a.source}
                <br />
                {a.location}
                <br />
                {a.date
                  ? new Date(a.date).toLocaleDateString("en-GB")
                  : ""}
              </div>
              <div style={{ marginTop: 8 }}>
                <a href={a.link} target="_blank" rel="noreferrer">
                  Open article
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
