function GridItemHeader({ name, price }) {
  return (
    <div className="flex items-start justify-between mb-3">
      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
        {name}
      </h3>
      <span className="px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full">
        ${price}
      </span>
    </div>
  );
}

export default GridItemHeader;
