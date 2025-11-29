import TableBody from './TableBody';
import TableHeader from './TableHeader';

function TableView({ data, columns, onEdit }) {
  const shouldHideColumn = (columnKey) => {
    const hiddenOnMobile = ['Description', 'Photo_Id', 'create_at'];
    return hiddenOnMobile.includes(columnKey);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <TableHeader cols={columns} onEdit={onEdit} shouldHideColumn={shouldHideColumn} />
          <TableBody data={data} cols={columns} onEdit={onEdit} shouldHideColumn={shouldHideColumn} />
        </table>
      </div>
    </div>
  );
}

export default TableView;
