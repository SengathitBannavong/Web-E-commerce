import { useEffect, useState } from 'react';
import { HiTrash, HiXMark } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import ConfirmDialog from '../ConfirmDialog.jsx';

function StockFormModal({ isOpen, onClose, onSubmit, onDelete, stock, mode = 'add' }) {
  const [formData, setFormData] = useState({ Product_Id: '', Quantity: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && stock) {
      setFormData({ Product_Id: stock.Product_Id || '', Quantity: stock.Quantity || 0 });
    } else {
      setFormData({ Product_Id: '', Quantity: '' });
    }
  }, [mode, stock, isOpen]);

  useEffect(() => { if (isOpen) document.body.style.overflow = 'hidden'; else document.body.style.overflow = 'unset'; }, [isOpen]);

  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.Product_Id) { toast.error('Product ID is required'); return; }
    if (formData.Quantity === '' || isNaN(Number(formData.Quantity))) { toast.error('Quantity is required'); return; }

    const cleaned = { Product_Id: String(formData.Product_Id), Quantity: Number(formData.Quantity) };
    onSubmit(cleaned);
    setFormData({ Product_Id: '', Quantity: '' });
    onClose();
  };

  const handleDelete = () => setShowDeleteConfirm(true);
  const confirmDelete = () => { onDelete(stock); setShowDeleteConfirm(false); };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{mode === 'edit' ? 'Edit Stock' : 'Add Stock'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg p-1 transition-all"><HiXMark className="text-2xl" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product ID</label>
            <input name="Product_Id" value={formData.Product_Id} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
            <input name="Quantity" type="number" min="0" value={formData.Quantity} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" required />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 px-2 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg">{mode === 'edit' ? 'Update' : 'Add'}</button>
            <button type="button" onClick={onClose} className="flex-1 px-2 py-2 border-2 border-slate-200 rounded-lg">Cancel</button>
            {mode === 'edit' && onDelete && (
              <button type="button" onClick={handleDelete} className="px-2 py-2 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-lg flex items-center gap-2"><HiTrash className="text-lg" />Delete</button>
            )}
          </div>
        </form>
      </div>

      <ConfirmDialog isOpen={showDeleteConfirm} onClose={() => { setShowDeleteConfirm(false); onClose(); }} onConfirm={confirmDelete} title="Delete Stock" message={`Are you sure you want to delete stock for "${stock?.Product_Id || 'this product'}"?`} confirmText="Delete" cancelText="Cancel" type="danger" />
    </div>
  );
}

export default StockFormModal;
