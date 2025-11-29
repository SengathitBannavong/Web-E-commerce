import ActivityItem from './ActivityItem';

function RecentActivity() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <ActivityItem key={item} item={item} />
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;
