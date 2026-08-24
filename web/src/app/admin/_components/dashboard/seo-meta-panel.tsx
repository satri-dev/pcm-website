import { seoHealth } from "../data";

function getScoreColor(score: number) {
  if (score >= 80) return "var(--admin-green)";
  if (score >= 60) return "var(--admin-gold)";
  return "var(--admin-red)";
}

function getScoreBadge(score: number) {
  if (score >= 80) return <span className="admin-badge admin-badge--green">Good</span>;
  if (score >= 60) return <span className="admin-badge admin-badge--gold">Needs Work</span>;
  return <span className="admin-badge admin-badge--red">Poor</span>;
}

export default function SeoMetaPanel() {
  const { overall, items, meta } = seoHealth;

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <div>
          <h3>SEO &amp; Meta</h3>
          <p>Site-wide SEO health overview</p>
        </div>
        <span
          className="admin-badge"
          style={{
            background: getScoreColor(overall) + "18",
            color: getScoreColor(overall),
          }}
        >
          {overall}%
        </span>
      </div>
      <div className="admin-panel__body admin-seo-health">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[0.82rem] font-semibold text-[var(--admin-ink)]">Overall Score</span>
            <span className="text-[0.82rem] font-bold" style={{ color: getScoreColor(overall) }}>
              {overall}/100
            </span>
          </div>
          <div className="admin-seo-health__bar">
            <div
              className="admin-seo-health__fill"
              style={{ width: `${overall}%` }}
            />
          </div>
        </div>

        <div className="admin-seo-list">
          {items.map((item) => (
            <div key={item.page} className="admin-seo-item">
              <span className="admin-seo-item__page">{item.page}</span>
              {getScoreBadge(item.score)}
              <span
                className="admin-seo-item__score"
                style={{ color: getScoreColor(item.score) }}
              >
                {item.score}
              </span>
            </div>
          ))}
        </div>

        <div className="admin-meta-grid">
          <div className="admin-meta-item">
            <span className="admin-meta-item__label">Titles</span>
            <span className="admin-meta-item__value">
              {meta.withTitle}/{meta.total}
            </span>
          </div>
          <div className="admin-meta-item">
            <span className="admin-meta-item__label">Descriptions</span>
            <span className="admin-meta-item__value">
              {meta.withDescription}/{meta.total}
            </span>
          </div>
          <div className="admin-meta-item">
            <span className="admin-meta-item__label">OG Images</span>
            <span className="admin-meta-item__value">
              {meta.withOgImage}/{meta.total}
            </span>
          </div>
          <div className="admin-meta-item">
            <span className="admin-meta-item__label">Pages</span>
            <span className="admin-meta-item__value">{meta.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
