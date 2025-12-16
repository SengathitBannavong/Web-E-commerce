import TableView from '../views/TableView/index';

function ProductBody({ products, columns, openEditModal }) {
  return (
    <div className="mt-6">
      <TableView data={products} columns={columns} onEdit={openEditModal} />
    </div>
  );
}

export default ProductBody;
