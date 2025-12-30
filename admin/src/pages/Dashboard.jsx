import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import StatsGrid from '../components/Dashboard/StatsGrid';
import { useDashboardContext } from '../contexts/DashboardContext';
import { useStoreContext } from '../contexts/StoreContext.jsx';

function DateRangePicker({ startDate, endDate, setStartDate, setEndDate, presets = [], setPreset, onCustomSet }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const [localStart, setLocalStart] = useState(startDate);
  const [localEnd, setLocalEnd] = useState(endDate);

  useEffect(() => {
    setLocalStart(startDate);
    setLocalEnd(endDate);
  }, [startDate, endDate]);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const label = () => {
    if (!startDate || !endDate) return 'Select date';
    if (startDate === endDate) return startDate;
    return `${startDate} — ${endDate}`;
  };

  const applyLocal = () => {
    setStartDate(localStart);
    setEndDate(localEnd);
    setOpen(false);
    if (onCustomSet) onCustomSet();
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={()=>setOpen(o=>!o)} className="inline-flex items-center gap-2 px-4 py-2 border rounded bg-white">
        <svg className="h-4 w-4 text-slate-600" viewBox="0 0 24 24" fill="none"><path d="M7 11h10M7 7h10M7 15h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span className="text-sm text-slate-700">{label()}</span>
        <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-72 bg-white border rounded shadow p-3">
          <div className="mb-2 text-sm text-slate-600">Quick ranges</div>
          <div className="flex gap-2 mb-3">
            {presets.map(p => (
              <button key={p} onClick={()=>{ setPreset(p); setOpen(false); }} className="px-2 py-1 text-sm border rounded bg-slate-50">{p}d</button>
            ))}
          </div>

          <div className="mb-2 text-sm text-slate-600">Custom Range</div>
          <div className="flex gap-2 items-center mb-3">
            <input type="date" value={localStart} onChange={e=>setLocalStart(e.target.value)} className="p-2 border rounded w-1/2" />
            <input type="date" value={localEnd} onChange={e=>setLocalEnd(e.target.value)} className="p-2 border rounded w-1/2" />
          </div>

          <div className="flex justify-end">
            <button onClick={()=>{ setLocalStart(startDate); setLocalEnd(endDate); setOpen(false); }} className="px-3 py-1 mr-2 text-sm">Cancel</button>
            <button onClick={applyLocal} className="px-3 py-1 bg-slate-800 text-white rounded text-sm">Set</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const { stats, lowStockCount } = useDashboardContext();
  const navigate = useNavigate();
  const { API, token } = useStoreContext();

  const toISO = (d) => new Date(d).toISOString().slice(0,10);
  const defaultEnd = toISO(new Date());
  const defaultStart = toISO(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000));

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [selectedPreset, setSelectedPreset] = useState(7);
  const [resources, setResources] = useState({ orders: true, revenue: true, products: true });
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [error, setError] = useState('');

  const presets = [7, 30, 90];

  const setPreset = (days) => {
    const end = new Date();
    const start = new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000);
    setStartDate(toISO(start));
    setEndDate(toISO(end));
    setSelectedPreset(days);
  };

  const isValidRange = useMemo(() => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    return s <= e;
  }, [startDate, endDate]);

  const totals = useMemo(() => {
    if (!insights) return { orders: 0, revenue: 0, products: 0 };
    const sum = (arr) => (arr || []).reduce((a, b) => a + Number(b.value || 0), 0);
    return { orders: sum(insights.orders), revenue: sum(insights.revenue), products: sum(insights.products) };
  }, [insights]);

  const fetchInsights = async () => {
    setInsightsLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}admin/dashboard/insights?start=${startDate}&end=${endDate}&resources=${Object.keys(resources).filter(k=>resources[k]).join(',')}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      setInsights(json);
    } catch (e) {
      console.error('Failed to fetch insights', e);
      setInsights(null);
      setError('Unable to load insights. Try again or check server logs.');
    } finally { setInsightsLoading(false); }
  };

  const resetAll = () => {
    setPreset(7);
    setResources({ orders: true, revenue: true, products: true });
    setInsights(null);
    setError('');
  };

  return (
    <div className="p-6">
      <DashboardHeader />

      {lowStockCount > 0 && (
        <div className="mb-4 p-4 rounded bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between">
          <div>
            <strong>{lowStockCount}</strong> product(s) are low in stock.
          </div>
          <button
            onClick={() => navigate('/stock?filter=low')}
            className="ml-4 inline-flex items-center px-3 py-1.5 border border-rose-300 bg-white text-sm rounded-md hover:bg-rose-50"
          >
            Review Stock
          </button>
        </div>
      )}

      <StatsGrid stats={stats} />

      <div className="mt-6 bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold mb-4">Insights</h3>

        <div className="flex flex-wrap gap-3 items-end mb-4">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            presets={presets}
            setPreset={setPreset}
          />
          <div className="flex items-center gap-12 ml-2 fit-content">
            <div className="flex items-center gap-2">
              <button title="Orders" aria-pressed={resources.orders} onClick={()=>setResources(s=>({...s,orders:!s.orders}))} className={`px-3 py-1 rounded text-sm flex items-center gap-2 ${resources.orders ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M3 3h18v4H3zM7 13h10v8H7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                orders
              </button>
              <button title="Revenue" aria-pressed={resources.revenue} onClick={()=>setResources(s=>({...s,revenue:!s.revenue}))} className={`px-3 py-1 rounded text-sm flex items-center gap-2 ${resources.revenue ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M12 1v22M17 5H9a3 3 0 000 6h6a3 3 0 010 6H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                revenue
              </button>
              <button title="Products" aria-pressed={resources.products} onClick={()=>setResources(s=>({...s,products:!s.products}))} className={`px-3 py-1 rounded text-sm flex items-center gap-2 ${resources.products ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M21 16V8l-9-5-9 5v8l9 5 9-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                products
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <button onClick={fetchInsights} disabled={!isValidRange || insightsLoading || !Object.values(resources).some(Boolean)} className="px-4 py-2 bg-slate-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {insightsLoading ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="31.4" strokeDashoffset="0"/></svg>
                  ) : null}
                  Apply
                </button>
                <button onClick={resetAll} className="px-3 py-1 text-sm rounded border bg-white hover:bg-slate-50">Reset</button>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="text-sm text-rose-600 mb-3">{error}</div>}

        {insightsLoading && <div className="text-sm text-slate-500">Loading insights...</div>}

        {insights == null && !insightsLoading && (
          <div className="h-48 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-500">
            <div className="text-center">
              <div className="text-lg font-semibold text-slate-800">Start exploring your insights.</div>
              <div className="mt-2">Choose a date range to view daily counts, trends, and resource details.</div>
            </div>
          </div>
        )}

        {insights && (
          <div>
            <div className="flex flex-wrap gap-3 mb-4 items-center">
              <div className="px-4 py-3 bg-slate-50 rounded border">
                <div className="text-xs text-slate-500">Total Orders</div>
                <div className="text-lg font-semibold">{totals.orders}</div>
              </div>
              <div className="px-4 py-3 bg-slate-50 rounded border">
                <div className="text-xs text-slate-500">Total Revenue</div>
                <div className="text-lg font-semibold">VND {Number(totals.revenue).toLocaleString()}</div>
              </div>
              <div className="px-4 py-3 bg-slate-50 rounded border">
                <div className="text-xs text-slate-500">Products Sold</div>
                <div className="text-lg font-semibold">{totals.products}</div>
              </div>
              <div className="ml-4 text-sm text-slate-600">Showing <strong className="text-slate-800">{startDate}</strong> — <strong className="text-slate-800">{endDate}</strong></div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-2 sticky left-0">Date</th>
                    {resources.orders && <th className="p-2">Orders</th>}
                    {resources.revenue && <th className="p-2">Revenue</th>}
                    {resources.products && <th className="p-2">Products Sold</th>}
                  </tr>
                </thead>
                <tbody>
                  {insights.dates.map(d => (
                    <tr key={d} className="odd:bg-white even:bg-slate-50">
                      <td className="p-2 font-medium whitespace-nowrap">{d}</td>
                      {resources.orders && (
                        <td className="p-2">{(insights.orders.find(s => s.date === d) || {}).value || 0}</td>
                      )}
                      {resources.revenue && (
                        <td className="p-2">VND {Number((insights.revenue.find(s => s.date === d) || {}).value || 0).toLocaleString()}</td>
                      )}
                      {resources.products && (
                        <td className="p-2">{(insights.products.find(s => s.date === d) || {}).value || 0}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {insights.meta && insights.meta.lowStockCount > 0 && (
              <div className="mt-3 text-sm text-rose-700">Low stock (overall): {insights.meta.lowStockCount}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;