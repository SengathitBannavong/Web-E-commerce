import { useEffect, useState } from 'react';
import { useCustomerContext } from '../../contexts/CustomerContext.jsx';

function CustomerHeader() {
  const { searchFilter, setSearchFilter, fetchCustomers, setPage } = useCustomerContext();
  const [searchTerm, setSearchTerm] = useState(searchFilter || '');

  useEffect(() => {
    setSearchTerm(searchFilter || '');
  }, [searchFilter]);

  const doSearch = () => {
    const val = (searchTerm || '').trim();
    setPage(1);
    setSearchFilter(val);
    fetchCustomers();
  };

  const onKeyDown = (e) => { if (e.key === 'Enter') doSearch(); };

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
          onKeyDown={onKeyDown}
          className="border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
        />

        <button onClick={doSearch} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-md transition-all">Search</button>

        <button onClick={() => fetchCustomers()} className="px-3 py-2 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-all">Refresh</button>
      </div>
    </div>
  );
}

export default CustomerHeader;
