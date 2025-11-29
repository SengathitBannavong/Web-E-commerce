import ProductBody from '../components/Product/ProductBody';
import ProductHeader from '../components/Product/ProductHeader';
import ProductFormModal from '../components/ProductFormModal.jsx';
import { useProductContext } from '../contexts/ProductContext.jsx';

function Products() {
  
  const {
    // States
    columns,
    viewButtons,
    viewMode,
    products,
    isModalOpen,
    modalMode,
    selectedProduct,
    // Actions
    setViewMode,
    setIsModalOpen,
    setSelectedProduct,
    handleDeleteProduct,
  } = useProductContext();

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

  return (
    <div Name="main-container" className="p-6">
      <ProductHeader 
        viewMode={viewMode}
        viewButtons={viewButtons}
        setViewMode={setViewMode}
        openAddModal={openAddModal}
      />

      <ProductBody 
        viewMode={viewMode}
        products={products}
        columns={columns}
        openEditModal={openEditModal}
      />

      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleSubmit}
        onDelete={handleDeleteProduct}
        product={selectedProduct}
        mode={modalMode}
      />
    </div>
  );
}

export default Products;