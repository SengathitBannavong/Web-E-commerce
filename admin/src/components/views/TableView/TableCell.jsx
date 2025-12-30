function TableCell({ column, item, shouldHideColumn, rowIndex = 0, page = 1, limit = 10 }) {
  const renderCellContent = (col, item) => {
    if (col.key === 'Index') {
      const p = Number(page) || 1;
      const l = Number(limit) || (Array.isArray(item) ? item.length : 0) || 1;
      const computed = (p - 1) * l + (Number(rowIndex) || 0) + 1;
      return computed;
    }
    if (col.key === 'Price') {
      const val = Number(item[col.key] || 0);
      return (
        <span className="inline-flex items-baseline gap-1 font-semibold text-emerald-600">
          <span className="text-sm">{val.toLocaleString()}</span>
          <span className="text-xs text-slate-500">VND</span>
        </span>
      );
    }
    if (col.key === 'created_at' || col.key === 'Date' || col.key === 'updated_at') {
      return item[col.key] ? item[col.key].split('T')[0] : '';
    }
    if(col.key === 'Role') {
      return item[col.key] === "admin" ? <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Admin</span> : <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">User</span>;
    }

    if(col.key === 'Photo_URL') {
      return item[col.key] ? <img src={item[col.key]} alt="Product" className="w-16 h-16 object-cover rounded-md" /> : <img src={"https://res.cloudinary.com/dskodfe9c/image/upload/v1766921014/zyjjrcl1qjwatmhiza7b.png"} alt="Simple Product" className="w-16 h-16 object-cover rounded-md"/>;
    }

    if (col.key === 'Quantity') {
      const qty = Number(item[col.key] || 0);
      let cls = 'bg-emerald-100 text-emerald-800';
      let label = String(qty);
      let title = `${qty} in stock`;
      if (qty <= 0) {
        cls = 'bg-rose-100 text-rose-800';
        label = 'Out of stock';
        title = 'No stock available';
      } else if (qty <= 10) {
        cls = 'bg-amber-100 text-amber-800';
        title = 'Low stock';
      }

      return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-semibold ${cls}`} title={title}>
          {label}
        </span>
      );
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
