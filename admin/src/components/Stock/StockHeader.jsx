import { useEffect, useState } from 'react';
import { useStockContext } from '../../contexts/StockContext.jsx';
import StockAction from './StockAction';

function StockHeader({ openAddModal }) {
  const { minQuantity, setMinQuantity, maxQuantity, setMaxQuantity, setPage } = useStockContext();
  const [minVal, setMinVal] = useState(minQuantity || '');
  const [maxVal, setMaxVal] = useState(maxQuantity || '');

  useEffect(() => { setMinVal(minQuantity || ''); setMaxVal(maxQuantity || ''); }, [minQuantity, maxQuantity]);

  const applyFilters = () => {
    setPage(1);
    setMinQuantity(minVal === '' ? '' : String(minVal));
    setMaxQuantity(maxVal === '' ? '' : String(maxVal));
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Stock</h1>
        <p className="text-slate-600">Manage product stock levels</p>
      </div>

      <div className="flex items-center gap-3">
        <input type="number" placeholder="Min qty" value={minVal} onChange={(e) => setMinVal(e.target.value)} className="border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200" />
        <input type="number" placeholder="Max qty" value={maxVal} onChange={(e) => setMaxVal(e.target.value)} className="border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200" />

        <button onClick={applyFilters} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-md transition-all">Filter</button>
        <StockAction openAddModal={openAddModal} />
      </div>
    </div>
  );
}

export default StockHeader;
