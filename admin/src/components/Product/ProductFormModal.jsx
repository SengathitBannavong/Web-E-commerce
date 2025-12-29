import { useEffect, useRef, useState } from 'react';
import { HiTrash, HiXMark } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import { useProductContext } from '../../contexts/ProductContext.jsx';
import ConfirmDialog from '../ConfirmDialog.jsx';

function ProductFormModal({ isOpen, onClose, onSubmit, onDelete, product, mode = 'add' }) {
  const [formData, setFormData] = useState({
    Name: '',
    Author: '',
    Description: '',
    Price: '',
    Category_Id: '',
  });
  const [photoImageForm, setPhotoImageForm] = useState(null);
  const fileInputRef = useRef(null);
  const { submitProductImage } = useProductContext();
  const uploadPromiseRef = useRef(null);
  const lastUploadResultRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData({
        Name: product.Name || '',
        Author: product.Author || '',
        Description: product.Description || '',
        Price: product.Price || '',
        Category_Id: product.Category_Id || '',
        Photo_Id: '',
        Photo_URL: '',
      });
      setPhotoImageForm(product.Photo_URL || '');
    } else {
      setFormData({
        Name: '',
        Author: '',
        Description: '',
        Price: '',
        Category_Id: '',
        Photo_Id: '',
        Photo_URL: '',
      });
      setPhotoImageForm(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.Name || !formData.Price || !formData.Author) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // wait for pending upload if present
    if (uploadPromiseRef.current) {
      setIsUploading(true);
      try {
        const res = await uploadPromiseRef.current;
        lastUploadResultRef.current = res;
      } catch (err) {
        // ignore and continue with existing form data
      } finally {
        uploadPromiseRef.current = null;
        setIsUploading(false);
      }
    }

    const finalPhotoId = lastUploadResultRef.current ? lastUploadResultRef.current.publicId : formData.Photo_Id || null;
    const finalPhotoUrl = lastUploadResultRef.current ? lastUploadResultRef.current.imageUrl : formData.Photo_URL || null;

    const cleanedData = {
      Name: formData.Name,
      Author: formData.Author,
      ...formData,
      Category_Id: formData.Category_Id === '' ? null : parseInt(formData.Category_Id),
      Price: parseFloat(formData.Price),
      Description: formData.Description || null,
      Photo_Id: finalPhotoId,
      Photo_URL: finalPhotoUrl,
    };

    if (mode === 'edit' && product) {
      onSubmit({ ...cleanedData, Product_Id: product.Product_Id, Index: product.Index });
    } else {
      onSubmit(cleanedData);
    }

    lastUploadResultRef.current = null;
    uploadPromiseRef.current = null;

    setFormData({
      Name: '',
      Author: '',
      Description: '',
      Price: '',
      Category_Id: '',
      Photo_Id: '',
      Photo_URL: '',
    });
    onClose();
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
                Photo
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                name="image"
                onChange={async (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;
                    // show immediate preview
                    const url = URL.createObjectURL(file);
                    setPhotoImageForm(url);

                    // start upload and track it
                    setIsUploading(true);
                    const promise = submitProductImage({image_form: file, productId: product ? product.Product_Id : null});
                    uploadPromiseRef.current = promise;
                    try {
                      const ret = await promise;
                      lastUploadResultRef.current = ret;
                      if (ret && ret.imageUrl) setPhotoImageForm(ret.imageUrl);
                      if (ret) {
                        setFormData(prev => ({ ...prev, Photo_URL: ret.imageUrl || null, Photo_Id: ret.publicId || null }));
                      }
                    } catch (err) {
                      console.error('Product image upload failed', err);
                    } finally {
                      uploadPromiseRef.current = null;
                      setIsUploading(false);
                    }
                  }}
                className="hidden"
              />

              <div className="mt-2">
                {photoImageForm ? (
                  <div className="flex items-start gap-3">
                    <img
                      src={photoImageForm instanceof File ? URL.createObjectURL(photoImageForm) : photoImageForm}
                      alt="product"
                      className="w-28 h-28 object-cover rounded-md cursor-pointer border"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    />
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        className="px-3 py-2 bg-slate-100 rounded-md text-sm text-slate-700"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={async () => { 
                          setPhotoImageForm(null);
                          setFormData(prev => ({ ...prev, Photo_URL: null, Photo_Id: null }));
                          setIsUploading(true);
                          const p = submitProductImage({image_form: null, productId: product ? product.Product_Id : null});
                          uploadPromiseRef.current = p;
                          try { 
                            await p;
                            lastUploadResultRef.current = null;
                          } catch (e) {
                             console.error(e); 
                          } finally {
                            uploadPromiseRef.current = null;
                            setIsUploading(false); 
                          }
                        }}
                        className="px-3 py-2 bg-rose-50 text-rose-600 rounded-md text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className="w-28 h-28 border border-dashed border-slate-300 rounded-md flex items-center justify-center text-slate-400 cursor-pointer"
                  >
                    Click to upload
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category ID
              </label>
              <input
                type="number"
                name="Category_Id"
                value={formData.Category_Id}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="0"
              />
            </div>

            {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              disabled={isUploading}
              type="submit"
              className={`flex-1 px-2 py-2 ${isUploading ? 'bg-slate-300 text-slate-600' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'} font-semibold rounded-lg hover:shadow-md hover:shadow-indigo-500/30 transition-all`}
            >
              {isUploading ? 'Uploading...' : (mode === 'edit' ? 'Update' : 'Add')}
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
        onClose={() => {
          setShowDeleteConfirm(false);
          onClose();
        }}
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
