
import { useState } from 'react';
import OrderBody from '../components/Order/OrderBody';
import OrderFormModal from '../components/Order/OrderFormModal.jsx';
import OrderHeader from '../components/Order/OrderHeader';
import { useOrderContext } from '../contexts/OrderContext.jsx';

function Orders() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');

  const {
    orders,
    selectedOrder,
    setSelectedOrder,
    handleDeleteOrder,
    handleUpdateOrder,
    handleAddOrderItem,
    page,
    setPage,
    limit,
    setLimit,
  } = useOrderContext();

  const columns = [
    { key: 'Index', label: 'Index' },
    { key: 'User_Id', label: 'User ID' },
    { key: 'Order_Id', label: 'Order ID' },
    { key: 'Status', label: 'Status' },
    { key: 'Amount', label: 'Amount' },
    { key: 'Date', label: 'Created At' },
  ];

  const handleSubmit = (formData) => {
    if (modalMode === 'edit') {
      handleUpdateOrder(formData);
    }
  };


  const openEditModal = (order) => {
    setModalMode('edit');
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const data = Array.isArray(orders) ? orders : (orders && orders.data) ? orders.data : [];
  const total = orders && (orders.total || orders.totalCount || orders.count);
  const canPrev = page > 1;
  const canNext = Array.isArray(data) ? data.length >= limit : true;

  return (
    <div Name="main-container" className="p-6">
      <OrderHeader/>

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

      <OrderBody
      orders={data}
      columns={columns}
      openEditModal={openEditModal}
      page={page}
      limit={limit}
      />

      <OrderFormModal
        mode={modalMode}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        onSubmit={handleSubmit}
        onDelete={handleDeleteOrder}
        order={selectedOrder}
      />
    </div>
  );
}

export default Orders;