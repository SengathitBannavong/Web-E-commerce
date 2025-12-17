import { useState } from 'react';
import { useCustomerContext } from '../../contexts/CustomerContext.jsx';

function CustomerHeader() {
  const { searchFilter, setSearchFilter, fetchCustomers, setPage } = useCustomerContext();
  const [searchTerm, setSearchTerm] = useState(searchFilter || '');

  const doSearch = () => {
    const val = (searchTerm || '').trim();
    setPage(1);
    setSearchFilter(val);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-sm text-slate-500">Manage customers and account details</p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Filter by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button onClick={doSearch} className="px-3 py-1 bg-blue-600 text-white rounded">Search</button>
        <button onClick={() => fetchCustomers()} className="px-3 py-1 bg-white border rounded">Refresh</button>
      </div>
    </div>
  );
}

export default CustomerHeader;
