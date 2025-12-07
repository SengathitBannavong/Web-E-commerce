function BoardItemMeta({ product }) {
  const metaItems = [
    { label: 'ID', value: product.Product_Id, mono: true },
    { label: 'Category', value: product.Category_Id || 'N/A' },
    { label: 'Photo', value: product.Photo_Id || 'N/A' },
  ];

  if (product.create_at) {
    metaItems.push({ 
      label: 'Created', 
      value: product.create_at.split('T')[0] 
    });
  }

  return (
    <div className="flex flex-wrap gap-4">
      {metaItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">{item.label}:</span>
          <span className={`text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded ${
            item.mono ? 'font-mono' : ''
          }`}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default BoardItemMeta;
