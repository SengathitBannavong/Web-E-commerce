function GridItemActions({ onEdit, product }) {
  if (!onEdit) return null;

  return (
    <button
      onClick={() => onEdit(product)}
      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-2.5 px-4 rounded-lg hover:shadow-md hover:shadow-indigo-500/30 transition-all"
    >
      Edit Product
    </button>
  );
}

export default GridItemActions;
