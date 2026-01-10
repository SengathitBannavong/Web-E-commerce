import { useMemo, useState } from 'react';
import { useOrderContext } from '../../contexts/OrderContext.jsx';

function OrderHeader() {
  const { userFilter, setUserFilter, statusFilter, setStatusFilter, fetchOrders, setPage, orders } = useOrderContext();

  const [searchTerm, setSearchTerm] = useState(userFilter || '');

  // Calculate pending orders count
  const pendingOrdersCount = useMemo(() => {
    const ordersArray = Array.isArray(orders) ? orders : (orders?.data || []);
    return ordersArray.filter(order => order.Status === 'pending').length;
  }, [orders]);

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
    <div className="space-y-4">
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
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
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

      {/* Pending Orders Alert */}
      {pendingOrdersCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="text-orange-800 font-medium">
                {pendingOrdersCount} order{pendingOrdersCount !== 1 ? 's' : ''} awaiting confirmation
              </span>
            </div>
            <button
              onClick={() => {
                setStatusFilter('pending');
                setPage(1);
                fetchOrders();
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
            >
              View Pending Orders
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHeader;
