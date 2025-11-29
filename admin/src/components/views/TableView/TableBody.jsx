import TableRow from './TableRow';

function TableBody({ data, cols, onEdit, shouldHideColumn }) {
  return (
    <tbody className="bg-white divide-y divide-slate-200">
      {data.map((item, index) => (
        <TableRow
          key={item.Product_Id || index}
          item={item}
          cols={cols}
          onEdit={onEdit}
          shouldHideColumn={shouldHideColumn}
        />
      ))}
    </tbody>
  );
}

export default TableBody;