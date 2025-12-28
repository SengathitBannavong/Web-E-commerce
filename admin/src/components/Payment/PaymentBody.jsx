import TableView from '../views/TableView/index';

function PaymentBody({ payments, columns, openEditModal, page = 1, limit = 10 }) {
  return (
    <div className="mt-6">
      <TableView data={payments} columns={columns} onEdit={openEditModal} page={page} limit={limit} />
    </div>
  );
}

export default PaymentBody;
