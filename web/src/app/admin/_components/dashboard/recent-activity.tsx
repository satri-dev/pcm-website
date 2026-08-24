import { recentActivity } from "../data";

export default function RecentActivity() {
  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <div>
          <h3>Recent Activity</h3>
          <p>Latest changes across the site</p>
        </div>
      </div>
      <div className="admin-panel__body">
        <div className="admin-activity">
          {recentActivity.map((item, i) => (
            <div key={i} className="admin-activity__item">
              <div className={`admin-activity__dot admin-activity__dot--${item.color}`} />
              <div>
                <p>{item.action}</p>
                <small>{item.time}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
