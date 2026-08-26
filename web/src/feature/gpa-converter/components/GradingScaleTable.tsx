import { PU_GRADING_SCALE, GRADE_COLORS } from "../data/grading";

export default function GradingScaleTable() {
  return (
    <div className="gpa-scale-wrap">
      <h3 className="gpa-scale-title">Pokhara University Grading Scale</h3>
      <div className="gpa-scale-table-wrap">
        <table className="gpa-scale-table">
          <thead>
            <tr>
              <th>Grade</th>
              <th>Grade Point</th>
              <th>Marks (%)</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {PU_GRADING_SCALE.map((g) => (
              <tr key={g.grade}>
                <td>
                  <span
                    className="gpa-scale-badge"
                    style={{ background: GRADE_COLORS[g.grade] ?? "#718096" }}
                  >
                    {g.grade}
                  </span>
                </td>
                <td className="gpa-scale-gp">{g.gradePoint.toFixed(1)}</td>
                <td className="gpa-scale-range">
                  {g.minPercent === 0
                    ? `< 30`
                    : `${g.minPercent} – ${g.maxPercent}`}
                </td>
                <td className="gpa-scale-desc">{g.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="gpa-scale-note">
        Percentage = (Obtained Marks ÷ Total Full Marks) × 100.
        Total Full Marks = Theory Full Marks + Practical/Internal Marks.
      </p>
    </div>
  );
}
