import BoardItemActions from './BoardItemActions';
import BoardItemBadge from './BoardItemBadge';
import BoardItemHeader from './BoardItemHeader';
import BoardItemMeta from './BoardItemMeta';

function BoardItem({ product, onEdit }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-indigo-500/10 transition-all">
      <div className="flex items-start gap-6">
        <BoardItemBadge index={product.Index} />
        
        <div className="flex-1 min-w-0">
          <BoardItemHeader name={product.Name} price={product.Price} />
          
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {product.Description || 'No description available'}
          </p>
          
          <BoardItemMeta product={product} />
        </div>
        
        <BoardItemActions onEdit={onEdit} item={product} />
      </div>
    </div>
  );
}

export default BoardItem;
