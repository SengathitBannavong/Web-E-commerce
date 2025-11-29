function BoardItemActions({ onEdit, item }) {
  if (!onEdit) return null;

  return (
    <div className="flex-shrink-0">
      <button
        onClick={() => onEdit(item)}
        className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-md hover:shadow-indigo-500/30 transition-all whitespace-nowrap"
      >
        Edit
      </button>
    </div>
  );
}

export default BoardItemActions;
