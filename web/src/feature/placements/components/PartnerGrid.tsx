import type { RecruitmentPartner } from "../types";
import PartnerCard from "./PartnerCard";

interface Props {
  partners: RecruitmentPartner[];
}

export default function PartnerGrid({ partners }: Props) {
  return (
    <div className="pl-partner-grid">
      {partners.map((partner) => (
        <div key={partner.id} className="reveal">
          <PartnerCard item={partner} />
        </div>
      ))}
    </div>
  );
}
