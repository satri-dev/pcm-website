import Link from "next/link";
import type { ApplicationStep } from "../types";

interface Props {
  steps: ApplicationStep[];
}

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowRight = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function HowToApply({ steps }: Props) {
  return (
    <div className="how-to-apply">
      <div className="how-to-apply__content">
        <ol className="checklist" aria-label="How to apply for a scholarship">
          {steps.map((step, i) => (
            <li key={step.id} className="checklist__item">
              <span className="checklist__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="checklist__icon" aria-hidden="true">
                <CheckIcon />
              </span>
              <span className="checklist__text">{step.text}</span>
            </li>
          ))}
        </ol>
        <div className="how-to-apply__cta">
          <Link href="/admission" className="sc-btn sc-btn-primary sc-btn-lg">
            Start your application <ArrowRight />
          </Link>
        </div>
      </div>
      <div className="how-to-apply__image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/img/about-1.jpg"
          alt="Students at PCM campus"
          loading="lazy"
        />
      </div>
    </div>
  );
}
