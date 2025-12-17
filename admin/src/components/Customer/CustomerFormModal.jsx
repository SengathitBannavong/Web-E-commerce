import { useEffect, useState } from 'react';
import { HiTrash, HiXMark } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import ConfirmDialog from '../ConfirmDialog.jsx';

function CustomerFormModal({ isOpen, onClose, onSubmit, onDelete, customer, mode = 'edit' ,setOpen}) {
  const [formData, setFormData] = useState({ Name: '', Email: '', Role: 'user' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && customer) {
      setFormData({
        Name: customer.Name || customer.name || '',
        Email: customer.Email || customer.email || '',
        Role: customer.Role || customer.role || 'user',
      });
    } else {
      setFormData({ Name: '', Email: '', Role: 'user' });
    }
  }, [mode, customer, isOpen]);

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
    if (!formData.Name || !formData.Email) {
      toast.error('Please provide name and email.');
      return;
    }

    const cleaned = {
      Name: formData.Name,
      Email: formData.Email,
      Role: formData.Role || 'user',
    };

    if (mode === 'edit' && customer) {
      onSubmit({ ...cleaned, User_Id: customer.User_Id || customer.id || customer._id });
    } else {
      onSubmit(cleaned);
    }

    onClose();
  };

  const handleDelete = () => setShowDeleteConfirm(true);
  const confirmDelete = () => {
    onDelete(customer);
    setShowDeleteConfirm(false);
    setOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h2 className="text-2xl font-bold">{mode === 'edit' ? 'Edit Customer' : 'Customer'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 rounded-lg p-1">
            <HiXMark className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input name="Name" value={formData.Name} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input name="Email" type="email" value={formData.Email} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select name="Role" value={formData.Role} onChange={handleChange} className="w-full px-3 py-2 border rounded">
              <option value="user">User</option>
              <option value="admin">Admin</option>
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
        onClose={() => {
          setShowDeleteConfirm(false)
        }}
        onConfirm={confirmDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete "${customer?.Name || customer?.Email || 'this customer'}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

export default CustomerFormModal;
