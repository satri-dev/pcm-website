import type { DownloadItem } from "../types";
import { CATEGORY_ICONS, formatDate, formatSize } from "../data/downloads";

interface Props {
  item: DownloadItem;
}

const DownloadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const CalIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const FileIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export default function DownloadCard({ item }: Props) {
  const icon = CATEGORY_ICONS[item.category] ?? "📄";

  return (
    <article className="dl-card">
      <div className="dl-card__top">
        <span className="dl-card__icon" aria-hidden="true">
          {icon}
        </span>
        <span className="dl-card__cat">{item.category}</span>
      </div>
      <h3 className="dl-card__title">{item.title}</h3>
      <p className="dl-card__desc">{item.description}</p>
      <div className="dl-card__meta">
        <span className="dl-card__meta-item">
          <CalIcon />
          {formatDate(item.date)}
        </span>
        <span className="dl-card__meta-item">
          <FileIcon />
          {formatSize(item.sizeKb)}
        </span>
      </div>
      <div className="dl-card__foot">
        <a
          href={item.fileUrl}
          className="dl-btn"
          target="_blank"
          rel="noopener noreferrer"
          download
          aria-label={`Download ${item.title}`}
        >
          <DownloadIcon />
          Download
        </a>
      </div>
    </article>
  );
}
