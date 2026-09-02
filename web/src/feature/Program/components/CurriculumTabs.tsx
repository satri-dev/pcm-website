"use client";

import { useState } from "react";
import type { Semester } from "../data/programs";

interface Props {
  semesters: Semester[];
  totalCredits: string;
}

export default function CurriculumTabs({ semesters, totalCredits }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="tabs" data-tabs>
        {/* Tab buttons */}
        <div className="tabs__list" role="tablist">
          {semesters.map((sem, i) => (
            <button
              key={sem.label}
              className={`tabs__btn${i === active ? " active" : ""}`}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
            >
              {sem.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        {semesters.map((sem, i) => (
          <div
            key={sem.label}
            className={`tabs__panel${i === active ? " active" : ""}`}
            role="tabpanel"
            hidden={i !== active}
          >
            {sem.courses.length === 0 ? (
              <p style={{ color: "var(--muted-c)", padding: "1rem 0" }}>
                No courses listed for this semester.
              </p>
            ) : (
              <div className="ctable-wrap">
                <table className="ctable">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left" }}>Code</th>
                      <th style={{ textAlign: "left" }}>Course Description</th>
                      <th style={{ textAlign: "left" }}>Credit Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sem.courses.map((course) => (
                      <tr key={`${course.code}-${course.description}`}>
                        <td style={{ textAlign: "left" }}>{course.code}</td>
                        <td
                          style={{
                            fontFamily: "var(--ff-body)",
                            color: "var(--body-c)",
                            textAlign: "left",
                          }}
                        >
                          {course.description}
                        </td>
                        <td style={{ textAlign: "left" }}>{course.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="credit-total reveal">
        <span>Total Credits for Program</span>
        <b>{totalCredits}</b>
      </div>
    </div>
  );
}
