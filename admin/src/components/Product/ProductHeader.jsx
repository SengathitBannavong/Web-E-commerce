import { useEffect, useState } from 'react';
import { useProductContext } from '../../contexts/ProductContext.jsx';
import ProductAction from '../Product/ProductAction';

function ProductHeader({ openAddModal }) {
  const { categoryFilter, setCategoryFilter, setPage } = useProductContext();

  const [inputValue, setInputValue] = useState(categoryFilter || '');

  // keep local input in sync if context changes externally
  useEffect(() => {
    setInputValue(categoryFilter || '');
  }, [categoryFilter]);

  // debounce updating context
  useEffect(() => {
    const handler = setTimeout(() => {
      const val = (inputValue || '').trim();
      if (val === '') {
        setCategoryFilter('');
        setPage(1);
      } else {
        setCategoryFilter(val);
        setPage(1);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [inputValue, setCategoryFilter, setPage]);

  const onCategoryChange = (e) => {
    // allow only digits (unsigned integers); strip non-digits
    const cleaned = e.target.value.replace(/\D+/g, '');
    setInputValue(cleaned);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Products</h1>
        <p className="text-slate-600">Manage your product inventory</p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="number"
          placeholder="Filter by Category ID"
          value={categoryFilter}
          onChange={onCategoryChange}
          className="border px-2 py-1 rounded"
        />

        <ProductAction 
          openAddModal={openAddModal} 
        />
      </div>
    </div>
  );
}

export default ProductHeader;
