import QuickActionButton from './QuickActionButton';

function QuickActions({ actions }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, idx) => (
          <QuickActionButton key={idx} action={action} />
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
