import BoardView from '../views/BoardView/index';
import GridView from '../views/GridView/index';
import TableView from '../views/TableView/index';

function ProductBody({ viewMode, products, columns, openEditModal }) {
  return (
    <div className="mt-6">
      {viewMode === 'table' && <TableView data={products} columns={columns} onEdit={openEditModal} />}
      {viewMode === 'grid' && <GridView data={products} onEdit={openEditModal} />}
      {viewMode === 'board' && <BoardView data={products} onEdit={openEditModal} />}
    </div>
  );
}

export default ProductBody;
