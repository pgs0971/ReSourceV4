import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icon paths for bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
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
    .filter((a) => Number.isFinite(a.lat) && Number.isFinite(a.lng))
    .map((a) => [a.lat, a.lng]);

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

        <MarkerClusterGroup chunkedLoading>
       {articles.map((a) => (
  <Marker
    key={a.id}
    position={[a.lat, a.lng]}
    icon={a.category === "Major Loss" ? lossIcon : maIcon}
  >
    <Popup>
      <strong>{a.title}</strong><br />
      <em>{a.category}</em><br />
      <a href={a.link} target="_blank" rel="noreferrer">
        Read article
      </a>
    </Popup>
  </Marker>
))}

      </MapContainer>
    </div>
  );
}
