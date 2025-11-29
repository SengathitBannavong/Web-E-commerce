function ProductAction({viewMode,viewButtons, setViewMode, openAddModal}) {
  return (
    <div name="actions" className="flex items-center gap-3">
      <div name="view-modes" className="flex gap-1 bg-white rounded-lg shadow-sm border border-slate-200 p-1">
        {viewButtons.map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
              viewMode === mode
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title={label}
          >
            <Icon className="text-lg" />
            <span className="hidden sm:inline text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
      
      <button 
        onClick={openAddModal}
        className='bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all font-medium flex items-center gap-2'
      >
      <span className="text-l">+</span>
        Add Product
      </button>
    </div>
  );
}

export default ProductAction;