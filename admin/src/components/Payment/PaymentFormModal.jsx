import { useEffect, useState } from 'react';
import { HiTrash, HiXMark } from 'react-icons/hi2';
import { usePaymentContext } from '../../contexts/PaymentContext.jsx';
import ConfirmDialog from '../ConfirmDialog.jsx';

function PaymentFormModal({ isOpen, onClose, onSubmit, onDelete, payment, mode = 'edit' }) {
  const { fetchPayments } = usePaymentContext();
  const [formData, setFormData] = useState({ User_Id: '', Status: 'pending' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && payment) {
      setFormData({
        User_Id: payment.User_Id || '',
        Status: payment.Status || 'pending',
      });
    } else {
      setFormData({ User_Id: '', Status: 'pending' });
    }
  }, [mode, payment, isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'Amount' ? Number(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'edit' && payment) {
      onSubmit({ ...formData, Payment_Id: payment.Payment_Id });
    } else {
      onSubmit(formData);
    }
    onClose();
  };

  const handleDelete = () => setShowDeleteConfirm(true);
  const confirmDelete = () => {
    onDelete(payment);
    setShowDeleteConfirm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h2 className="text-2xl font-bold">Payment Details</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 rounded-lg p-1">
            <HiXMark className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">User ID</label>
            <input name="User_Id" value={formData.User_Id} className="w-full px-3 py-2 border rounded" readOnly />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select name="Type" value={formData.Type} className="w-full px-3 py-2 border rounded" disabled>
              <option value="credit_card">Credit Card</option>
              <option value="paypal">Paypal</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
            <input name="Amount" type="number" step="0.01" value={formData.Amount} className="w-full px-3 py-2 border rounded" readOnly  />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select name="Status" value={formData.Status} onChange={handleChange} className="w-full px-3 py-2 border rounded">
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 px-2 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg">Update</button>
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
        title="Delete Payment"
        message={`Are you sure you want to delete this payment? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

export default PaymentFormModal;
