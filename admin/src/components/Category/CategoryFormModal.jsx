import { useEffect, useState } from 'react';
import { HiTrash, HiXMark } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import ConfirmDialog from '../ConfirmDialog.jsx';

function CategoryFormModal({ isOpen, onClose, onSubmit, onDelete, category, mode = 'add' }) {
  const [formData, setFormData] = useState({ Name: '', Description: '', Photo_Id: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && category) {
      setFormData({
        Name: category.Name || '',
        Description: category.Description || '',
        Photo_Id: category.Photo_Id || '',
      });
    } else {
      setFormData({ Name: '', Description: '', Photo_Id: '' });
    }
  }, [mode, category, isOpen]);

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
    if (!formData.Name) {
      toast.error('Please provide a category name.');
      return;
    }
    const cleaned = {
      Name: formData.Name,
      Description: formData.Description || null,
      Photo_Id: formData.Photo_Id || null,
    };
    if (mode === 'edit' && category) {
      onSubmit({ ...cleaned, Category_Id: category.Category_Id });
    } else {
      onSubmit(cleaned);
    }
    setFormData({ Name: '', Description: '', Photo_Id: '' });
    onClose();
  };

  const handleDelete = () => setShowDeleteConfirm(true);
  const confirmDelete = () => { onDelete(category); setShowDeleteConfirm(false); };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {mode === 'edit' ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg p-1 transition-all">
            <HiXMark className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
            <input name="Name" value={formData.Name} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea name="Description" value={formData.Description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Photo ID</label>
            <input name="Photo_Id" value={formData.Photo_Id} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 px-2 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg">{mode === 'edit' ? 'Update' : 'Add'}</button>
            <button type="button" onClick={onClose} className="flex-1 px-2 py-2 border-2 border-slate-200 rounded-lg">Cancel</button>
            {mode === 'edit' && onDelete && (
              <button type="button" onClick={handleDelete} className="px-2 py-2 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-lg flex items-center gap-2">
                <HiTrash className="text-lg" /> Delete
              </button>
            )}
          </div>
        </form>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => { setShowDeleteConfirm(false); onClose(); }}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${category?.Name || 'this category'}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

export default CategoryFormModal;
