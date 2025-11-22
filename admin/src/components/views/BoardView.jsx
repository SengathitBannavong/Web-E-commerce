
function BoardView({ data, onEdit }) {
  return (
    <div className="flex flex-col space-y-3">
      {data.map((product, index) => (
        <div 
          key={product.Product_Id || index}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-[#FEE2AD] rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-[#F08787]">
                {product.Index}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  {product.Name}
                </h3>
                <span className="text-lg font-bold text-green-600">
                  ${product.Price}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {product.Description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Product ID:</span>{' '}
                  <span className="text-gray-700">{product.Product_Id}</span>
                </div>
                <div>
                  <span className="font-medium">Category:</span>{' '}
                  <span className="text-gray-700">{product.Category_Id}</span>
                </div>
                <div>
                  <span className="font-medium">Photo ID:</span>{' '}
                  <span className="text-gray-700">{product.Photo_Id}</span>
                </div>
                {product.create_at && (
                  <div>
                    <span className="font-medium">Created:</span>{' '}
                    <span className="text-gray-700">{product.create_at}</span>
                  </div>
                )}
              </div>
            </div>
            {onEdit && (
              <div className="flex-shrink-0">
                <button
                  onClick={() => onEdit(product)}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default BoardView;
