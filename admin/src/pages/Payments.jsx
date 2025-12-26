
import { useState } from 'react';
import PaymentBody from '../components/Payment/PaymentBody';
import PaymentFormModal from '../components/Payment/PaymentFormModal.jsx';
import PaymentHeader from '../components/Payment/PaymentHeader.jsx';
import { usePaymentContext } from '../contexts/PaymentContext.jsx';

function Payments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('edit');

  const {
    payments,
    selectedPayment,
    setSelectedPayment,
    handleDeletePayment,
    handleUpdatePayment,
    page,
    setPage,
    limit,
    setLimit,
  } = usePaymentContext();

  const columns = [
    { key: 'Index', label: 'Index' },
    { key: 'User_Id', label: 'User ID' },
    { key: 'Payment_Id', label: 'Payment ID' },
    { key: 'Type', label: 'Type' },
    { key: 'Status', label: 'Status' },
    { key: 'Amount', label: 'Amount' },
    { key: 'created_at', label: 'Created At' },
    { key: 'updated_at', label: 'Updated At' },
  ];

  const openEditModal = (payment) => {
    setModalMode('edit');
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (modalMode === 'edit') {
      handleUpdatePayment(formData);
    }
  };

  const raw = Array.isArray(payments) ? payments : (payments && payments.data) ? payments.data : [];

  const data = raw;

  const total = payments && (payments.total || payments.totalCount || payments.count);
  const canPrev = page > 1;
  const canNext = Array.isArray(data) ? data.length >= limit : true;

  return (
    <div Name="main-container" className="p-6">
      <PaymentHeader/>

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

      <PaymentBody
        payments={data}
        columns={columns}
        openEditModal={openEditModal}
        page={page}
        limit={limit}
      />

      <PaymentFormModal
        mode={modalMode}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPayment(null);
        }}
        onSubmit={handleSubmit}
        onDelete={handleDeletePayment}
        payment={selectedPayment}
      />
    </div>
  );
}

export default Payments;