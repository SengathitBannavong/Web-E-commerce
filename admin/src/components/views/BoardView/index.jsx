import BoardItem from './BoardItem';

function BoardView({ data, onEdit }) {
  return (
    <div className="flex flex-col space-y-4">
      {data.map((product, index) => (
        <BoardItem
          key={product.Product_Id || index}
          product={product}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default BoardView;
