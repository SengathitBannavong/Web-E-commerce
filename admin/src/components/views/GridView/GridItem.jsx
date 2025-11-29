import GridItemActions from './GridItemActions';
import GridItemHeader from './GridItemHeader';
import GridItemMeta from './GridItemMeta';

function GridItem({ product, onEdit }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <GridItemHeader name={product.Name} price={product.Price} />
          
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {product.Description || 'No description available'}
          </p>
        </div>
        
        <GridItemMeta product={product} />
        <GridItemActions onEdit={onEdit} product={product} />
      </div>
    </div>
  );
}

export default GridItem;
