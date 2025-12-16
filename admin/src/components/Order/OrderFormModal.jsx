import { useEffect, useState } from 'react';
import { HiTrash, HiXMark } from 'react-icons/hi2';
import { useOrderContext } from '../../contexts/OrderContext.jsx';
import ConfirmDialog from '../ConfirmDialog.jsx';

function OrderFormModal({ isOpen, onClose, onSubmit, onDelete, order, mode = 'add' }) {
  const { fetchOrderItems } = useOrderContext();
  const [formData, setFormData] = useState({ User_Id: '', Status: 'pending' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (mode === 'edit' && order) {
      setFormData({ User_Id: order.User_Id || '', Status: order.Status || 'pending' });
      (async () => {
        const res = await fetchOrderItems(order.Order_Id, 1, 20);
        setItems(res && res.data ? res.data : []);
      })();
    } else {
      setFormData({ User_Id: '', Status: 'pending' });
      setItems([]);
    }
  }, [mode, order, isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.User_Id) return;
    if (mode === 'edit' && order) {
      onSubmit({ ...formData, Order_Id: order.Order_Id });
    } else {
      onSubmit(formData);
    }
    onClose();
  };

  const handleDelete = () => setShowDeleteConfirm(true);

  const confirmDelete = () => {
    onDelete(order);
    setShowDeleteConfirm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h2 className="text-2xl font-bold">{mode === 'edit' ? 'Order Details' : 'Create Order'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 rounded-lg p-1">
            <HiXMark className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">User ID</label>
            <input name="User_Id" value={formData.User_Id} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select name="Status" value={formData.Status} onChange={handleChange} className="w-full px-3 py-2 border rounded">
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {mode === 'edit' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Items</label>
              <div className="border rounded p-2 max-h-48 overflow-y-auto">
                {items.length === 0 && <p className="text-sm text-slate-500">No items</p>}
                {items.map(it => (
                  <div key={it.Order_Item_Id} className="flex justify-between text-sm py-1 border-b last:border-b-0">
                    <div>{it.product?.Name || it.Product_Id} x {it.Quantity}</div>
                    <div className="text-slate-600">${it.Amount?.toFixed ? it.Amount.toFixed(2) : it.Amount}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 px-2 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg">{mode === 'edit' ? 'Update' : 'Create'}</button>
            <button type="button" onClick={onClose} className="flex-1 px-2 py-2 border rounded-lg">Cancel</button>
            {mode === 'edit' && onDelete && (
              <button type="button" onClick={handleDelete} className="px-2 py-2 bg-rose-500 text-white rounded-lg">
                <HiTrash />
              </button>
            )}
          </div>
        </form>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Order"
        message={`Are you sure you want to delete this order? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

export default OrderFormModal;
