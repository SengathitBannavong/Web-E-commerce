import { useEffect, useRef, useState } from 'react';

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

export default DateRangePicker;
