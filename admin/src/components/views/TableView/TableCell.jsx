function TableCell({ column, item, shouldHideColumn, rowIndex = 0, page = 1, limit = 10 }) {
  const renderCellContent = (col, item) => {
    if (col.key === 'Index') {
      const p = Number(page) || 1;
      const l = Number(limit) || (Array.isArray(item) ? item.length : 0) || 1;
      const computed = (p - 1) * l + (Number(rowIndex) || 0) + 1;
      return computed;
    }
    if (col.key === 'Price') {
      return <span className="font-semibold text-emerald-600">${item[col.key]}</span>;
    }
    if (col.key === 'created_at' || col.key === 'Date' || col.key === 'updated_at') {
      return item[col.key] ? item[col.key].split('T')[0] : '';
    }
    if(col.key === 'Role') {
      return item[col.key] === "admin" ? <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Admin</span> : <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">User</span>;
    }
    return item[col.key];
  };

  return (
    <td 
      className={`px-6 py-4 text-sm text-slate-700 ${
        shouldHideColumn(column.key) ? 'hidden md:table-cell' : ''
      }`}
    >
      {renderCellContent(column, item)}
    </td>
  );
}

export default TableCell;
