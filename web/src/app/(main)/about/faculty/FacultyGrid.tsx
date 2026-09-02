"use client";

import { SectionHead } from "../legacy/section-head";
import { FacultyCard } from "./FacultyCard";

export interface FacultyPerson {
  name: string;
  role: string;
  photo: string;
}

export function FacultyGrid({
  leadership,
  team,
  leadershipEyebrow,
  leadershipTitle,
  teamEyebrow,
  teamTitle,
}: {
  leadership: FacultyPerson[];
  team: FacultyPerson[];
  leadershipEyebrow: string;
  leadershipTitle: string;
  teamEyebrow: string;
  teamTitle: string;
}) {
  return (
    <>
      <section className="section">
        <div className="wrap-wide">
          <SectionHead eyebrow={leadershipEyebrow} title={leadershipTitle} />
          {leadership.length === 0 ? (
            <p style={{ padding: "1rem 0", color: "var(--muted)" }}>
              No leadership members found.
            </p>
          ) : (
            <div className="grid g-4" style={{ marginTop: "2rem" }}>
              {leadership.map((person, i) => (
                <FacultyCard
                  key={person.name || `leader-${i}`}
                  person={person}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="section tone-sky">
        <div className="wrap-wide">
          <SectionHead eyebrow={teamEyebrow} title={teamTitle} />
          {team.length === 0 ? (
            <p style={{ padding: "1rem 0", color: "var(--muted)" }}>
              No faculty members found.
            </p>
          ) : (
            <div className="grid g-4" style={{ marginTop: "2rem" }}>
              {team.map((person, i) => (
                <FacultyCard
                  key={person.name || `member-${i}`}
                  person={person}
                  index={i % 4}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
