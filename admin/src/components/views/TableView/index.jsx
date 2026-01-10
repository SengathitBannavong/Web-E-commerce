import TableBody from './TableBody';
import TableHeader from './TableHeader';

function TableView({ data, columns, onEdit, onConfirmOrder, onRejectOrder, page = 1, limit = 10 }) {
  const shouldHideColumn = (columnKey) => {
    const hiddenOnMobile = ['Description', 'Photo_Id', 'create_at'];
    return hiddenOnMobile.includes(columnKey);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <TableHeader cols={columns} onEdit={onEdit} shouldHideColumn={shouldHideColumn} />
          <TableBody 
            data={data} 
            cols={columns} 
            onEdit={onEdit} 
            onConfirmOrder={onConfirmOrder}
            onRejectOrder={onRejectOrder}
            shouldHideColumn={shouldHideColumn} 
            page={page} 
            limit={limit} 
          />
        </table>
      </div>
    </div>
  );
}

export default TableView;
