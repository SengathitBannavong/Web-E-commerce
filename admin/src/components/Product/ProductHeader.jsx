import { useEffect, useState } from 'react';
import { useProductContext } from '../../contexts/ProductContext.jsx';
import ProductAction from '../Product/ProductAction';

function ProductHeader({ openAddModal }) {
  const { categoryFilter, setCategoryFilter, setPage, fetchProducts } = useProductContext();

  const [inputValue, setInputValue] = useState(categoryFilter || '');

  // keep local input in sync if context changes externally
  useEffect(() => {
    setInputValue(categoryFilter || '');
  }, [categoryFilter]);

  const doSearch = () => {
    const val = (inputValue || '').trim();
    setPage(1);
    setCategoryFilter(val);
    fetchProducts();
  };

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
          value={inputValue}
          onChange={onCategoryChange}
          onKeyDown={(e) => { if (e.key === 'Enter') doSearch(); }}
          className="border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
        />

        <button onClick={doSearch} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-md transition-all">Search</button>

        <ProductAction
          openAddModal={openAddModal}
        />
      </div>
    </div>
  );
}

export default ProductHeader;
