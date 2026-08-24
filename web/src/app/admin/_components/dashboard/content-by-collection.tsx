import { contentByCollection } from "../../data";

export default function ContentByCollection() {
  const max = Math.max(...contentByCollection.map((i) => i.value));

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <div>
          <h3>Content by Collection</h3>
          <p>Items across all content types</p>
        </div>
        <span className="admin-badge admin-badge--blue">
          {contentByCollection.reduce((sum, i) => sum + i.value, 0)} total
        </span>
      </div>
      <div className="admin-panel__body">
        {contentByCollection.map((item) => (
          <div key={item.label} className="admin-bar-row">
            <div className="admin-bar-row__label">{item.label}</div>
            <div className="admin-bar-row__track">
              <div
                className="admin-bar-row__fill"
                style={{
                  width: `${Math.max(3, (item.value / max) * 100)}%`,
                  background: item.color,
                }}
              />
            </div>
            <div className="admin-bar-row__value">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
