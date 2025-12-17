
import { useState } from 'react';
import CustomerBody from '../components/Customer/CustomerBody';
import CustomerFormModal from '../components/Customer/CustomerFormModal.jsx';
import CustomerHeader from '../components/Customer/CustomerHeader';
import { useCustomerContext } from '../contexts/CustomerContext.jsx';

function Customers() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    customers,
    selectedCustomer,
    setSelectedCustomer,
    handleDeleteCustomer,
    handleUpdateCustomer,
    page,
    setPage,
    limit,
    setLimit,
    setSearchFilter,
  } = useCustomerContext();

  const columns = [
    { key: 'Index', label: 'Index' },
    { key: 'Name', label: 'Name' },
    { key: 'Email', label: 'Email' },
    { key: 'User_Id', label: 'User ID' },
    { key: 'Role', label: 'Role' },
    { key: 'Date', label: 'Created At' },
  ];

  const handleSubmit = (formData) => {
    if (selectedCustomer) {
      handleUpdateCustomer(formData);
    }
  };

  const openEditModal = (user) => {
    setSelectedCustomer(user);
    setIsModalOpen(true);
  };

  const data = Array.isArray(customers) ? customers : (customers && customers.data) ? customers.data : [];
  const total = customers && (customers.total || customers.totalCount || customers.count);
  const canPrev = page > 1;
  const canNext = Array.isArray(data) ? data.length >= limit : true;

  return (
    <div Name="main-container" className="p-6">
      <CustomerHeader setSearchFilter={setSearchFilter} />

      <div className="flex items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => canPrev && setPage(page - 1)}
            disabled={!canPrev}
            className={`px-3 py-1 rounded-md border ${canPrev ? 'bg-white' : 'bg-slate-100 text-slate-400'}`}
          >
            Prev
          </button>

          <span className="px-3">Page {page}{total ? ` of ${Math.ceil(total/limit)}` : ''}</span>

          <button
            onClick={() => canNext && setPage(page + 1)}
            disabled={!canNext}
            className={`px-3 py-1 rounded-md border ${canNext ? 'bg-white' : 'bg-slate-100 text-slate-400'}`}
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Show</label>
          <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <CustomerBody
        customers={data}
        columns={columns}
        openEditModal={openEditModal}
        page={page}
        limit={limit}
      />

      <CustomerFormModal
        mode={'edit'}
        isOpen={isModalOpen}
        setOpen={setIsModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSubmit={handleSubmit}
        onDelete={handleDeleteCustomer}
        customer={selectedCustomer}
      />

    </div>
  );
}

export default Customers;