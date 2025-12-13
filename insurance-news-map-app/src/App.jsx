import { useEffect, useMemo, useState } from "react";
import NewsMap from "./components/NewsMap.jsx";
import Filters from "./components/Filters.jsx";

function normalizeArticle(a) {
  return {
    ...a,
    lat: typeof a.lat === "string" ? Number(a.lat) : a.lat,
    lng: typeof a.lng === "string" ? Number(a.lng) : a.lng,
  };
}

export default function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState("ALL");
  const [source, setSource] = useState("ALL");
  const [days, setDays] = useState(10);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/get-news");
      const data = await res.json();
      setArticles(Array.isArray(data) ? data.map(normalizeArticle) : []);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const cutoff = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
  }, [days]);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (!Number.isFinite(a.lat) || !Number.isFinite(a.lng)) return false;
      if (a.date && new Date(a.date) < cutoff) return false;
      if (category !== "ALL" && a.category !== category) return false;
      if (source !== "ALL" && a.source !== source) return false;
      return true;
    });
  }, [articles, category, source, cutoff]);

  const categories = useMemo(() => {
    const set = new Set(filtered.map((a) => a.category));
    return Array.from(set);
  }, [filtered]);

  const sources = useMemo(() => {
    const set = new Set(filtered.map((a) => a.source));
    return Array.from(set);
  }, [filtered]);

  // Ensure filters never point to missing values
  useEffect(() => {
    if (category !== "ALL" && !categories.includes(category)) setCategory("ALL");
  }, [categories, category]);

  useEffect(() => {
    if (source !== "ALL" && !sources.includes(source)) setSource("ALL");
  }, [sources, source]);

  return (
    <div className="app">
      <div className="header">
        <div className="brand">
          <h1>Insurance & Reinsurance News Intelligence Map</h1>
          <p>Mapped Major Losses + M&A from free sources, refreshed on demand.</p>
        </div>
      </div>

      <Filters
        category={category}
        setCategory={setCategory}
        source={source}
        setSource={setSource}
        days={days}
        setDays={setDays}
        categories={categories}
        sources={sources}
        onRefresh={load}
        loading={loading}
        countShown={filtered.length}
        countTotal={articles.length}
      />

      <div className="grid">
        <NewsMap articles={filtered} />

        <div className="panel">
          <div className="small" style={{ marginBottom: 8, opacity: 0.85 }}>
            Latest mapped items
          </div>
          <div className="list">
            {filtered.map((a) => (
              <div className="item" key={a.id}>
                <div className="meta">
                  <span>{a.category}</span>
                  <span>•</span>
                  <span>{a.source}</span>
                  <span>•</span>
                  <span>{a.date ? new Date(a.date).toLocaleDateString("en-GB") : ""}</span>
                </div>
                <h3>
                  <a href={a.link} target="_blank" rel="noreferrer">
                    {a.title}
                  </a>
                </h3>
                <div className="small">{a.location}</div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="small">No mapped articles match the current filters.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
