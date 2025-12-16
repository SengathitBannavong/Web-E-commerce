import TableView from '../views/TableView/index';

function OrderBody({ orders, columns, openEditModal, page = 1, limit = 10 }) {
  return (
    <div className="mt-6">
      <TableView data={orders} columns={columns} onEdit={openEditModal} page={page} limit={limit} />
    </div>
  );
}

export default OrderBody;
