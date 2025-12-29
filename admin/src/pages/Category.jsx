
import { useState } from 'react';
import CategoryBody from '../components/Category/CategoryBody';
import CategoryFormModal from '../components/Category/CategoryFormModal.jsx';
import CategoryHeader from '../components/Category/CategoryHeader';
import { useCategoryContext } from '../contexts/CategoryContext.jsx';

function Category() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');

  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    handleDeleteCategory,
    handleAddCategory,
    handleUpdateCategory,
    page,
    setPage,
    limit,
    setLimit,
  } = useCategoryContext();

  const columns = [
    { key: 'Index', label: 'Index' },
    { key: 'Photo_URL', label: 'Photo' },
    { key: 'Name', label: 'Name' },
    { key: 'Category_Id', label: 'Category ID' },
    { key: 'Description', label: 'Description' },
  ];

  const handleSubmit = (formData) => {
    if (modalMode === 'edit') handleUpdateCategory(formData);
    else handleAddCategory(formData);
  };

  const openAddModal = () => {
    setModalMode('add');
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const data = Array.isArray(categories) ? categories : (categories && categories.data) ? categories.data : [];
  const total = categories && (categories.total || categories.totalCount || categories.count);
  const canPrev = page > 1;
  const canNext = Array.isArray(data) ? data.length >= limit : true;

  return (
    <div Name="main-container" className="p-6">
      <CategoryHeader openAddModal={openAddModal} />

      <div className="flex items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => canPrev && setPage(page - 1)}
            disabled={!canPrev}
            className={`px-3 py-1 rounded-md border ${canPrev ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-md' : 'bg-slate-100 text-slate-400'}`}
          >
            Prev
          </button>

          <span className="px-3">Page {page}{total ? ` of ${Math.ceil(total/limit)}` : ''}</span>

          <button
            onClick={() => canNext && setPage(page + 1)}
            disabled={!canNext}
            className={`px-3 py-1 rounded-md border ${canNext ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-md' : 'bg-slate-100 text-slate-400'}`}
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Show</label>
          <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="border rounded px-3 py-1 outline-none">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <CategoryBody
        categories={data}
        columns={columns}
        openEditModal={openEditModal}
        page={page}
        limit={limit}
      />

      <CategoryFormModal
        mode={modalMode}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedCategory(null); }}
        onSubmit={handleSubmit}
        onDelete={handleDeleteCategory}
        category={selectedCategory}
      />
    </div>
  );
}

export default Category;
