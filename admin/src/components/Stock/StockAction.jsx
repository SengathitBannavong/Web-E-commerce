function StockAction({ openAddModal }) {
  return (
    <div name="actions" className="flex items-center gap-3">
      <button 
        onClick={openAddModal}
        className='bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all font-medium flex items-center gap-2'
      >
        <span className="text-l">+</span>
        Add Stock
      </button>
    </div>
  );
}

export default StockAction;
