import { useState } from 'react';
import ProductBody from '../components/Product/ProductBody';
import ProductFormModal from '../components/Product/ProductFormModal.jsx';
import ProductHeader from '../components/Product/ProductHeader';
import { useProductContext } from '../contexts/ProductContext.jsx';

function Products() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  
  const {
    // States
    products,
    selectedProduct,
    setSelectedProduct,
    handleDeleteProduct,
    handleAddProduct,
    handleUpdateProduct,
    page,
    setPage,
    limit,
    setLimit,
  } = useProductContext();


  const columns = [
    { key: 'Index', label: 'Index' },
    { key: 'Product_Id', label: 'Product ID' },
    { key: 'Name', label: 'Name' },
    { key: 'Description', label: 'Description' },
    { key: 'Price', label: 'Price' },
    { key: 'Photo_Id', label: 'Photo ID' },
    { key: 'Category_Id', label: 'Category' },
    { key: 'created_at', label: 'Created At' },
  ];

  const handleSubmit = (formData) => {
    if (modalMode === 'edit') {
      handleUpdateProduct(formData);
    } else {
      handleAddProduct(formData);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const data = Array.isArray(products) ? products : (products && products.data) ? products.data : [];
  const total = products && (products.total || products.totalCount || products.count);
  const canPrev = page > 1;
  const canNext = Array.isArray(data) ? data.length >= limit : true;

  return (
    <div Name="main-container" className="p-6">
      <ProductHeader 
        openAddModal={openAddModal}
      />

      <div className="flex items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => canPrev && setPage(page - 1)}
            disabled={!canPrev}
            className={`px-3 py-1 rounded-md border ${canPrev ? 'bg-white' : 'bg-slate-100 text-slate-400'}`}
          >
            Prev
          </button>

          <span className="px-3">Page {page}{total ? ` of ${Math.ceil(total/limit)}` : ''}</span>

          <button
            onClick={() => canNext && setPage(page + 1)}
            disabled={!canNext}
            className={`px-3 py-1 rounded-md border ${canNext ? 'bg-white' : 'bg-slate-100 text-slate-400'}`}
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Show</label>
          <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <ProductBody
        products={data}
        columns={columns}
        openEditModal={openEditModal}
        page={page}
        limit={limit}
      />

      <ProductFormModal 
        mode={modalMode}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleSubmit}
        onDelete={handleDeleteProduct}
        product={selectedProduct}
      />
    </div>
  );
}

export default Products;