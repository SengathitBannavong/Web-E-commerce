function TableCell({ column, item, shouldHideColumn }) {
  const renderCellContent = (col, item) => {
    if (col.key === 'Price') {
      return <span className="font-semibold text-emerald-600">${item[col.key]}</span>;
    }
    if (col.key === 'created_at') {
      return item[col.key] ? item[col.key].split('T')[0] : '';
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
