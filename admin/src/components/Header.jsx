import { HiOutlineBars3 } from 'react-icons/hi2';

function Header({onMenuClick}) {
  return (
    <header className='h-16 bg-[#FEE2AD]/25 border-b border-[#F8FAB4] flex items-center px-4 md:px-6 top-0 z-20'>
      <div className="flex items-center justify-between w-full">
        <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-slate-100 rounded-lg">
          <HiOutlineBars3 className="w-6 h-6 text-slate-600" />
        </button>
      </div>
    </header>
  );
}

export default Header;