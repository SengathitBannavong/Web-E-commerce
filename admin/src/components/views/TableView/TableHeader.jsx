function TableHeader({ cols, onEdit, shouldHideColumn }) {
  return (
    <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
      <tr>
        {cols.map((column) => (
          <th 
            key={column.key} 
            className={`px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider ${
              shouldHideColumn(column.key) ? 'hidden md:table-cell' : ''
            }`}
          >
            {column.label}
          </th>
        ))}
        {onEdit && (
          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Actions
          </th>
        )}
      </tr>
    </thead>
  );
}

export default TableHeader;