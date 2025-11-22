function GridView({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {data.map((product, index) => (
        <div 
          key={product.Product_Id || index}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {product.Name}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.Description}
              </p>
            </div>
            <div className="space-y-1 text-xs text-gray-500">
              <div className="flex justify-between">
                <span className="font-medium">Price:</span>
                <span className="text-green-600 font-semibold">${product.Price}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">ID:</span>
                <span>{product.Product_Id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Category:</span>
                <span>{product.Category_Id}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GridView;
