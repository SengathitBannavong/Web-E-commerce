import { useEffect, useState } from 'react';
import { useOrderContext } from '../../contexts/OrderContext.jsx';

function OrderHeader() {
  const { userFilter, setUserFilter, statusFilter, setStatusFilter, fetchOrders } = useOrderContext();

  const [searchTerm, setSearchTerm] = useState(userFilter || '');

  // debounce updating
  useEffect(() => {
    const handler = setTimeout(() => {
      const val = (searchTerm || '').trim();
      if (val === '') {
        setUserFilter('');
      } else if (val.length >= 8) {
        setUserFilter(val);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm, setUserFilter]);

  const onStatusChange = (e) => {
    setStatusFilter(e.target.value);
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
          className="border px-2 py-1 rounded"
        />

        <select value={statusFilter} onChange={onStatusChange} className="border px-2 py-1 rounded">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>

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
