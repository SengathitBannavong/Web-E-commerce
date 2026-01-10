import TableView from '../views/TableView/index';

function OrderBody({ orders, columns, openEditModal, onConfirmOrder, onRejectOrder, page = 1, limit = 10 }) {
  return (
    <div className="mt-6">
      <TableView 
        data={orders} 
        columns={columns} 
        onEdit={openEditModal} 
        onConfirmOrder={onConfirmOrder}
        onRejectOrder={onRejectOrder}
        page={page} 
        limit={limit} 
      />
    </div>
  );
}

export default OrderBody;
