function StatCard({ stat }) {
  const Icon = stat.icon;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
          <Icon 
            className={`w-6 h-6 bg-gradient-to-br ${stat.color} text-transparent bg-clip-text`} 
            style={{WebkitTextFillColor: 'transparent', backgroundClip: 'text'}} 
          />
        </div>
        <span className="text-sm font-semibold text-emerald-600">{stat.change}</span>
      </div>
      <h3 className="text-slate-600 text-sm font-medium mb-1">{stat.title}</h3>
      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
    </div>
  );
}

export default StatCard;
