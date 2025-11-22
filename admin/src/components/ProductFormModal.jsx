import { useEffect, useState } from 'react';
import { HiTrash, HiXMark } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import ConfirmDialog from './ConfirmDialog.jsx';

function ProductFormModal({ isOpen, onClose, onSubmit, onDelete, product, mode = 'add' }) {
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Price: '',
    Photo_Id: '',
    Category_Id: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData({
        Name: product.Name || '',
        Description: product.Description || '',
        Price: product.Price || '',
        Photo_Id: product.Photo_Id || '',
        Category_Id: product.Category_Id || '',
      });
    } else {
      setFormData({
        Name: '',
        Description: '',
        Price: '',
        Photo_Id: '',
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
    if (!formData.Name || !formData.Price) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const cleanedData = {
      ...formData,
      Category_Id: formData.Category_Id === '' ? null : parseInt(formData.Category_Id),
      Price: parseFloat(formData.Price),
      Photo_Id: formData.Photo_Id || null,
      Description: formData.Description || null,
    };
    
    if (mode === 'edit' && product) {
      onSubmit({ ...cleanedData, Product_Id: product.Product_Id, Index: product.Index });
    } else {
      onSubmit(cleanedData);
    }
    
    setFormData({
      Name: '',
      Description: '',
      Price: '',
      Photo_Id: '',
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
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'edit' ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HiXMark className="text-2xl" />
          </button>
        </div>
        {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FEE2AD] focus:border-transparent outline-none"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FEE2AD] focus:border-transparent outline-none resize-none"
                placeholder="Enter product description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                name="Price"
                value={formData.Price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FEE2AD] focus:border-transparent outline-none"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo ID
              </label>
              <input
                type="text"
                name="Photo_Id"
                value={formData.Photo_Id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FEE2AD] focus:border-transparent outline-none"
                placeholder="photo_example"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category ID
              </label>
              <input
                type="number"
                name="Category_Id"
                value={formData.Category_Id}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FEE2AD] focus:border-transparent outline-none"
                placeholder="0"
              />
            </div>

            {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-2 py-2 bg-[#FEE2AD] text-black font-semibold rounded-lg hover:bg-[#FED876] transition-colors"
            >
              {mode === 'edit' ? 'Update' : 'Add'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-2 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {mode === 'edit' && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
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
