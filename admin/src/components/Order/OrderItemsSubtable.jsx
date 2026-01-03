import { useEffect, useState } from 'react';
import { useOrderContext } from '../../contexts/OrderContext.jsx';

function OrderItemsSubtable({ orderId }) {
  const { fetchOrderItems } = useOrderContext();
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetchOrderItems(orderId, 1, 20);
      if (mounted) setItems(res && res.data ? res.data : []);
    })();
    return () => { mounted = false; };
  }, [orderId]);

  if (!items || items.length === 0) return <div className="text-sm text-slate-500">No items</div>;

  return (
    <div className="mt-2 border rounded p-2">
      {items.map(it => (
        <div key={it.Order_Item_Id} className="flex justify-between text-sm py-1 border-b last:border-b-0">
          <div>{it.product?.Name || it.Product_Id} x {it.Quantity}</div>
          <div className="text-slate-600">VND {it.Amount?.toFixed ? it.Amount.toFixed(2) : it.Amount}</div>
        </div>
      ))}
    </div>
  );
}

export default OrderItemsSubtable;
