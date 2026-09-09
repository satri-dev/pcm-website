import { summaryStats, type SummaryStatId } from "../../data";
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

interface SummaryCardsProps {
  values: Record<SummaryStatId, number>;
  subs?: Partial<Record<SummaryStatId, string>>;
}

export default function SummaryCards({ values, subs = {} }: SummaryCardsProps) {
  return (
    <div className="admin-stats">
      {summaryStats.map((stat) => {
        const Icon = iconMap[stat.icon];
        return (
          <div key={stat.id} className={`admin-stat admin-stat--${stat.color}`}>
            <div className="admin-stat__label">
              {Icon && <Icon size={15} />}
              {stat.label}
            </div>
            <div className="admin-stat__value">{values[stat.id]}</div>
            <div className="admin-stat__sub">{subs[stat.id] ?? stat.sub}</div>
          </div>
        );
      })}
    </div>
  );
}
