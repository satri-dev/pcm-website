import { summaryStats } from "../data";
import {
  FileText,
  Pencil,
  ImageIcon,
  Users,
  GraduationCap,
  MessageSquare,
  SlidersHorizontal,
} from "lucide-react";

const iconMap: Record<string, React.FC<{ size?: number }>> = {
  pages: FileText,
  posts: Pencil,
  gallery: ImageIcon,
  team: Users,
  programs: GraduationCap,
  enquiries: MessageSquare,
  media: SlidersHorizontal,
};

export default function SummaryCards() {
  return (
    <div className="admin-stats">
      {summaryStats.map((stat) => {
        const Icon = iconMap[stat.icon];
        return (
          <div key={stat.label} className={`admin-stat admin-stat--${stat.color}`}>
            <div className="admin-stat__label">
              {Icon && <Icon size={15} />}
              {stat.label}
            </div>
            <div className="admin-stat__value">{stat.value}</div>
            <div className="admin-stat__sub">{stat.sub}</div>
          </div>
        );
      })}
    </div>
  );
}
