import Link from "next/link";
import { quickActions } from "../data";
import {
  Pencil,
  ImageIcon,
  FileText,
  Users,
  MessageSquare,
  Search,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  edit: Pencil,
  gallery: ImageIcon,
  pages: FileText,
  team: Users,
  enquiries: MessageSquare,
  seo: Search,
};

const colorMap: Record<string, string> = {
  brand: "var(--admin-brand)",
  gold: "var(--admin-gold)",
  green: "var(--admin-green)",
  blue: "#2f8fb0",
  red: "var(--admin-red)",
  violet: "#7a54d6",
};

export default function QuickActions() {
  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <div>
          <h3>Quick Actions</h3>
          <p>Frequently used operations</p>
        </div>
      </div>
      <div className="admin-panel__body">
        <div className="admin-quick-actions">
          {quickActions.map((action) => {
            const Icon = iconMap[action.icon];
            return (
              <Link key={action.label} href={action.href} className="admin-quick-action">
                <div
                  className="admin-quick-action__icon"
                  style={{ background: colorMap[action.color] }}
                >
                  {Icon && <Icon size={18} />}
                </div>
                {action.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
