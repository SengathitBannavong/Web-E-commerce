function TableRowActions({ onEdit, item }) {
  if (!onEdit) return null;

  return (
    <td className="px-6 py-4 text-sm">
      <button
        onClick={() => onEdit(item)}
        className="text-white px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-md hover:shadow-indigo-500/30 transition-all font-medium"
      >
        Edit
      </button>
    </td>
  );
}

export default TableRowActions;
