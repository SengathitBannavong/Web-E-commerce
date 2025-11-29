function BoardItemBadge({ index }) {
  return (
    <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
      <span className="text-3xl font-bold text-white">
        {index}
      </span>
    </div>
  );
}

export default BoardItemBadge;
