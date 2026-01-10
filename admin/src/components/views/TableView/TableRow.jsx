import TableCell from './TableCell';
import TableRowActions from './TableRowActions';

function TableRow({ item, cols, onEdit, onConfirmOrder, onRejectOrder, shouldHideColumn, rowIndex = 0, page = 1, limit = 10 }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      {cols.map((column) => (
        <TableCell
          key={column.key}
          column={column}
          item={item}
          rowIndex={rowIndex}
          page={page}
          limit={limit}
          shouldHideColumn={shouldHideColumn}
        />
      ))}
      <TableRowActions 
        onEdit={onEdit} 
        onConfirmOrder={onConfirmOrder}
        onRejectOrder={onRejectOrder}
        item={item} 
      />
    </tr>
  );
}

export default TableRow;