function TableRowActions({ onEdit, onConfirmOrder, onRejectOrder, item }) {
  if (!onEdit) return null;

  const isPendingOrder = item.Status === 'pending' && onConfirmOrder && onRejectOrder;

  return (
    <td className="px-6 py-4 text-sm">
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(item)}
          className="text-white px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-md hover:shadow-indigo-500/30 transition-all font-medium"
        >
          Edit
        </button>
        
        {isPendingOrder && (
          <>
            <button
              onClick={() => onConfirmOrder(item)}
              className="text-white px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 transition-all font-medium"
            >
              Confirm
            </button>
            <button
              onClick={() => onRejectOrder(item)}
              className="text-white px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 transition-all font-medium"
            >
              Reject
            </button>
          </>
        )}
      </div>
    </td>
  );
}

export default TableRowActions;
