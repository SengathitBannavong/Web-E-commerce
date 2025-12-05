function GridItemMeta({ product }) {
  return (
    <div className="space-y-2 mb-4">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">Product ID:</span>
        <span className="text-slate-700 font-mono">{product.Product_Id}</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">Author:</span>
        <span className="text-slate-700">{product.Author || 'N/A'}</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">Category:</span>
        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
          {product.Category_Id || 'N/A'}
        </span>
      </div>
    </div>
  );
}

export default GridItemMeta;
