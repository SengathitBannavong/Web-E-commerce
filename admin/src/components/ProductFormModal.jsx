import { useEffect, useState } from 'react';
import { HiTrash, HiXMark } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import ConfirmDialog from './ConfirmDialog.jsx';

function ProductFormModal({ isOpen, onClose, onSubmit, onDelete, product, mode = 'add' }) {
  const [formData, setFormData] = useState({
    Name: '',
    Author: '',
    Description: '',
    Price: '',
    Cover_Url: '',
    Category_Id: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData({
        Name: product.Name || '',
        Author: product.Author || '',
        Description: product.Description || '',
        Price: product.Price || '',
        Cover_Url: product.Cover_Url || '',
        Category_Id: product.Category_Id || '',
      });
    } else {
      setFormData({
        Name: '',
        Author: '',
        Description: '',
        Price: '',
        Cover_Url: '',
        Category_Id: '',
      });
    }
  }, [mode, product, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.Name || !formData.Price || !formData.Author) {
      toast.error("Please fill in all required fields (Name, Author, Price).");
      return;
    }
    const cleanedData = {
      ...formData,
      Category_Id: formData.Category_Id === '' ? null : parseInt(formData.Category_Id),
      Price: parseFloat(formData.Price),
      Cover_Url: formData.Cover_Url || null,
      Description: formData.Description || null,
    };
    
    if (mode === 'edit' && product) {
      onSubmit({ ...cleanedData, Product_Id: product.Product_Id, Index: product.Index });
    } else {
      onSubmit(cleanedData);
    }
    
    setFormData({
      Name: '',
      Author: '',
      Description: '',
      Price: '',
      Cover_Url: '',
      Category_Id: '',
    });
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(product);
    setShowDeleteConfirm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {mode === 'edit' ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg p-1 transition-all"
          >
            <HiXMark className="text-2xl" />
          </button>
        </div>
        {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Author
              </label>
              <input
                type="text"
                name="Author"
                value={formData.Author}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Enter author name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all"
                placeholder="Enter product description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Price
              </label>
              <input
                type="number"
                name="Price"
                value={formData.Price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Cover URL
              </label>
              <input
                type="text"
                name="Cover_Url"
                value={formData.Cover_Url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-2 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-md hover:shadow-indigo-500/30 transition-all"
            >
              {mode === 'edit' ? 'Update' : 'Add'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-2 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all font-medium"
            >
              Cancel
            </button>
            {mode === 'edit' && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-2 py-2 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-lg hover:shadow-md hover:shadow-rose-500/30 transition-all flex items-center gap-2 font-medium"
              >
                <HiTrash className="text-lg" />
                Delete
              </button>
            )}
          </div>
        </form>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${product?.Name || 'this product'}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

export default ProductFormModal;
