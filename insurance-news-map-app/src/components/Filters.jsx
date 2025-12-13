export default function Filters({
  category,
  setCategory,
  source,
  setSource,
  days,
  setDays,
  categories,
  sources,
  onRefresh,
  loading,
  countShown,
  countTotal,
}) {
  return (
    <div className="panel">
      <div className="controls">
        <label className="small">
          Category{" "}
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="ALL">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="small">
          Source{" "}
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="ALL">All</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="small">
          Range{" "}
          <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
            <option value={5}>Last 5 days</option>
            <option value={10}>Last 10 days</option>
            <option value={30}>Last 30 days</option>
          </select>
        </label>

        <button onClick={onRefresh} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh"}
        </button>

        <span className="small">
          Showing {countShown} / {countTotal}
        </span>
      </div>
    </div>
  );
}
