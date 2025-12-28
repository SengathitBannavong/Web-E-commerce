import { useState } from 'react';
import { usePaymentContext } from '../../contexts/PaymentContext.jsx';

function PaymentHeader() {
  const { userFilter, setUserFilter, statusFilter, setStatusFilter, fetchPayments, setPage } = usePaymentContext();

  const [searchTerm, setSearchTerm] = useState(userFilter || '');

  const onStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
    fetchPayments();
  };

  const doSearch = () => {
    const val = (searchTerm || '').trim();
    setPage(1);
    setUserFilter(val);
    fetchPayments();
  };


  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-sm text-slate-500">Manage payments — view, filter and update statuses</p>
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
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>

        <button onClick={doSearch} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-md transition-all">Search</button>

        <button
          onClick={() => fetchPayments()}
          className="px-3 py-1 bg-white border rounded"
        >
          Refresh
        </button>

      </div>
    </div>
  );
}

export default PaymentHeader;
