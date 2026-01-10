import TableRow from './TableRow';

function TableBody({ data, cols, onEdit, onConfirmOrder, onRejectOrder, shouldHideColumn, page = 1, limit = 10 }) {
  const row = Array.isArray(data) ? data : [];
  return (
    <tbody className="bg-white divide-y divide-slate-200">
      {row.map((item, index) => (
        <TableRow
          key={item.Payment_Id || item.Product_Id || item.Order_Id || index}
          item={item}
          cols={cols}
          onEdit={onEdit}
          onConfirmOrder={onConfirmOrder}
          onRejectOrder={onRejectOrder}
          shouldHideColumn={shouldHideColumn}
          rowIndex={index}
          page={page}
          limit={limit}
        />
      ))}
    </tbody>
  );
}

export default TableBody;