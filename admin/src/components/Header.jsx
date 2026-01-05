import { HiOutlineBars3, HiOutlineBell } from 'react-icons/hi2';

function Header({onMenuClick}) {
  return (
    <header className='h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-4 md:px-6 sticky top-0 z-20 shadow-sm'>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4 flex-1">
          <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <HiOutlineBars3 className="w-6 h-6 text-slate-700" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;