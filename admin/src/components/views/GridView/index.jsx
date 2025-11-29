import GridItem from './GridItem';

function GridView({ data, onEdit }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map((product, index) => (
        <GridItem
          key={product.Product_Id || index}
          product={product}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default GridView;
