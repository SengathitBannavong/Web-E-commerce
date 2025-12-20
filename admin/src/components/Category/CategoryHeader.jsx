import { useEffect, useState } from 'react';
import { useCategoryContext } from '../../contexts/CategoryContext.jsx';
import CategoryAction from './CategoryAction';

function CategoryHeader({ openAddModal }) {
  const { searchName, setSearchName, setPage, fetchCategories, sortOrder, setSortOrder } = useCategoryContext();
  const [inputValue, setInputValue] = useState(searchName || '');

  useEffect(() => {
    setInputValue(searchName || '');
  }, [searchName]);

  const doSearch = () => {
    const val = (inputValue || '').trim();
    setPage(1);
    setSearchName(val);
    fetchCategories();
  };

  const onKeyDown = (e) => { if (e.key === 'Enter') doSearch(); };

  const toggleSort = () => {
    const next = sortOrder === 'asc' ? 'desc' : 'asc';
    setPage(1);
    setSortOrder(next);
    fetchCategories();
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Categories</h1>
        <p className="text-slate-600">Manage categories for your store</p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by Name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          className="border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
        />

        <button onClick={doSearch} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-md transition-all">Search</button>

        <button onClick={toggleSort} className="px-3 py-2 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-all flex items-center gap-2">
          <span className="text-sm">ID</span>
          <span className="text-xs">{sortOrder === 'asc' ? '▲' : '▼'}</span>
        </button>

        <CategoryAction openAddModal={openAddModal} />
      </div>
    </div>
  );
}

export default CategoryHeader;
