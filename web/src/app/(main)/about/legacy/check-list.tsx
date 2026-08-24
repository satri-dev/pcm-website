import { CheckIcon } from "./icons";

export function CheckList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={className ?? "checklist"}>
      {items.map((item) => (
        <li key={item}>
          <CheckIcon /> {item}
        </li>
      ))}
    </ul>
  );
}
