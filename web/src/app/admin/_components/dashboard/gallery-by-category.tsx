import { galleryByCategory } from "../../data";

export default function GalleryByCategory() {
  const total = galleryByCategory.reduce((sum, i) => sum + i.count, 0);

  const r = 15.9;
  const c = 2 * Math.PI * r;
  let offset = 0;

  const segments = galleryByCategory.map((item) => {
    const len = (item.count / total) * c;
    const seg = {
      color: item.color,
      dasharray: `${len} ${c - len}`,
      dashoffset: -offset,
    };
    offset += len;
    return seg;
  });

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <div>
          <h3>Gallery by Category</h3>
          <p>Photo distribution</p>
        </div>
      </div>
      <div className="admin-panel__body" style={{ display: "grid", placeItems: "center" }}>
        <div className="admin-donut-wrap" style={{ width: 150, height: 150 }}>
          <svg viewBox="0 0 42 42" width="150" height="150">
            <circle
              cx="21" cy="21" r={r}
              fill="none" stroke="#eef1f6" strokeWidth="4"
            />
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx="21" cy="21" r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="4"
                strokeDasharray={seg.dasharray}
                strokeDashoffset={seg.dashoffset}
                transform="rotate(-90 21 21)"
              />
            ))}
          </svg>
          <div className="admin-donut-center">
            <b>{total}</b>
            <span>total</span>
          </div>
        </div>

        <div className="admin-chart-legend">
          {galleryByCategory.map((item) => (
            <span key={item.label}>
              <i style={{ background: item.color }} />
              {item.label} · <b>{item.count}</b>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
