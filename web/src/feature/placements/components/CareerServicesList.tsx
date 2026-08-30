import type { CareerService } from "../types";

interface Props {
  services: CareerService[];
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

export default function CareerServicesList({ services }: Props) {
  return (
    <ul className="pl-services-list">
      {services.map((service) => (
        <li key={service.id} className="pl-services-list__item">
          <span className="pl-services-list__check">
            <CheckIcon />
          </span>
          <span className="pl-services-list__text">{service.text}</span>
        </li>
      ))}
    </ul>
  );
}
