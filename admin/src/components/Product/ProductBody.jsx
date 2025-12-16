import TableView from '../views/TableView/index';

function ProductBody({ products, columns, openEditModal, page = 1, limit = 10 }) {
  return (
    <div className="mt-6">
      <TableView data={products} columns={columns} onEdit={openEditModal} page={page} limit={limit} />
    </div>
  );
}

export default ProductBody;
