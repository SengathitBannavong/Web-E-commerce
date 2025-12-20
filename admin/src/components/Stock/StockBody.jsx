import TableView from '../views/TableView/index';

function StockBody({ stocks, columns, openEditModal, page = 1, limit = 10 }) {
  return (
    <div className="mt-6">
      <TableView data={stocks} columns={columns} onEdit={openEditModal} page={page} limit={limit} />
    </div>
  );
}

export default StockBody;
