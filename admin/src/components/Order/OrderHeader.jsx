import { useState } from 'react';
import { useOrderContext } from '../../contexts/OrderContext.jsx';

function OrderHeader() {
  const { userFilter, setUserFilter, statusFilter, setStatusFilter, fetchOrders, setPage } = useOrderContext();

  const [searchTerm, setSearchTerm] = useState(userFilter || '');

  const onStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
    fetchOrders();
  };

  const doSearch = () => {
    const val = (searchTerm || '').trim();
    setPage(1);
    setUserFilter(val);
    fetchOrders();
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-slate-500">Manage orders and view order details</p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Filter by User ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') doSearch(); }}
          className="border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
        />

        <select value={statusFilter} onChange={onStatusChange} className="border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button onClick={doSearch} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-md transition-all">Search</button>

        <button
          onClick={() => fetchOrders()}
          className="px-3 py-1 bg-white border rounded"
        >
          Refresh
        </button>

      </div>
    </div>
  );
}

export default OrderHeader;
