function Logo() {
  return (
    <div className="h-16 flex items-center px-6 border-b border-slate-200">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">J9</span>
        </div>
        <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Jerry's Bookstore
        </div>
      </div>
    </div>
  );
}

export default Logo;