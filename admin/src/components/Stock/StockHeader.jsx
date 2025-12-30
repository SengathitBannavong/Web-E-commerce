import { useSearchParams } from 'react-router-dom';
import { useStockContext } from '../../contexts/StockContext.jsx';
import StockAction from './StockAction';

function StockHeader({ openAddModal }) {
  const { setPage, filter, setFilter } = useStockContext();

  const refresh = () => {
    setPage(1);
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const onFilterChange = (e) => {
    const v = e.target.value || '';
    setFilter(v);
    setPage(1);

    // remove filter param from URL and reset page to 1
    const np = new URLSearchParams(searchParams.toString());
    np.delete('filter');
    np.set('filter', v);
    setSearchParams(np, { replace: true });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Stock</h1>
        <p className="text-slate-600">Manage product stock levels</p>
      </div>

      <div className="flex items-center gap-3">
        <select value={filter || ''} onChange={onFilterChange} className="border rounded px-3 py-1 outline-none">
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="out">Out</option>
        </select>

        <StockAction openAddModal={openAddModal} />
        <button onClick={refresh} className="px-3 py-1 bg-white border rounded">Refresh</button>
      </div>
    </div>
  );
}

export default StockHeader;
