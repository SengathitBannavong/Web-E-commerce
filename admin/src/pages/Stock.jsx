import { useState } from 'react';
import StockBody from '../components/Stock/StockBody';
import StockFormModal from '../components/Stock/StockFormModal.jsx';
import StockHeader from '../components/Stock/StockHeader';
import { useStockContext } from '../contexts/StockContext.jsx';

function Stock() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');

  const {
    stocks,
    allStocks,
    selectedStock,
    setSelectedStock,
    handleDeleteStock,
    handleUpsertStock,
    page,
    setPage,
    limit,
    setLimit,
  } = useStockContext();

  const columns = [
    { key: 'Index', label: 'Index' },
    { key: 'Product_Id', label: 'Product ID' },
    { key: 'Product_Name', label: 'Product Name' },
    { key: 'Product_Price', label: 'Price' },
    { key: 'Quantity', label: 'Quantity' },
    { key: 'Last_Updated', label: 'Last Updated' },
  ];

  const handleSubmit = (formData) => {
    if (modalMode === 'edit') {
      handleUpsertStock(formData);
    } else {
      handleUpsertStock(formData);
    }
  };

  const openAddModal = () => { setModalMode('add'); setSelectedStock(null); setIsModalOpen(true); };
  const openEditModal = (stock) => { setModalMode('edit'); setSelectedStock(stock); setIsModalOpen(true); };

  const data = Array.isArray(stocks) ? stocks : (stocks && stocks.data) ? stocks.data : [];
  const total = allStocks && (allStocks.total);
  const canPrev = page > 1;
  const canNext = Array.isArray(data) ? data.length >= limit : true;

  return (
    <div Name="main-container" className="p-6">
      <StockHeader openAddModal={openAddModal} />

      <div className="flex items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2">
          <button onClick={() => canPrev && setPage(page - 1)} disabled={!canPrev} className={`px-3 py-1 rounded-md border ${canPrev ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-md' : 'bg-slate-100 text-slate-400'}`}>Prev</button>

          <span className="px-3">Page {page}{total ? ` of ${Math.ceil(total/limit)}` : ''}</span>

          <button onClick={() => canNext && setPage(page + 1)} disabled={!canNext} className={`px-3 py-1 rounded-md border ${canNext ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-md' : 'bg-slate-100 text-slate-400'}`}>Next</button>
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

      <StockBody stocks={data} columns={columns} openEditModal={openEditModal} page={page} limit={limit} />

      <StockFormModal mode={modalMode} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedStock(null); }} onSubmit={handleSubmit} onDelete={handleDeleteStock} stock={selectedStock} />
    </div>
  );
}

export default Stock;
