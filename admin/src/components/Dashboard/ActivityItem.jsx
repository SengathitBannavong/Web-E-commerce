function ActivityItem({ item }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900">New order received</p>
        <p className="text-xs text-slate-500">2 minutes ago</p>
      </div>
    </div>
  );
}

export default ActivityItem;
