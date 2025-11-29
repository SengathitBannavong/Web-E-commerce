function QuickActionButton({ action }) {
  return (
    <button className="p-4 rounded-lg border-2 border-dashed border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-sm font-medium text-slate-700 hover:text-indigo-600">
      {action}
    </button>
  );
}

export default QuickActionButton;
