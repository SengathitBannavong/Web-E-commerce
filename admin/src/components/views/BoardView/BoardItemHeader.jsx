function BoardItemHeader({ name, price }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
      <h3 className="text-xl font-bold text-slate-900">
        {name}
      </h3>
      <span className="text-xl font-bold text-emerald-600 whitespace-nowrap">
        ${price}
      </span>
    </div>
  );
}

export default BoardItemHeader;
