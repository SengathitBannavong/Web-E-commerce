import TableCell from './TableCell';
import TableRowActions from './TableRowActions';

function TableRow({ item, cols, onEdit, shouldHideColumn }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      {cols.map((column) => (
        <TableCell
          key={column.key}
          column={column}
          item={item}
          shouldHideColumn={shouldHideColumn}
        />
      ))}
      <TableRowActions onEdit={onEdit} item={item} />
    </tr>
  );
}

export default TableRow;