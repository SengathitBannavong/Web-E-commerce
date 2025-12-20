import {
  HiOutlineCube,
  HiOutlineCurrencyDollar,
  HiOutlineShoppingCart,
  HiOutlineUsers,
  HiSquares2X2,
  HiViewColumns
} from "react-icons/hi2";
import Logo from './Logo.jsx';
import Nav_items from './NavbarItems.jsx';
import User_profile from './User_profile.jsx';

function Sidebar({isOpen, onClose}) {
  const nav_items = [
    { id: 'dashboard', label: 'Dashboard', icon: HiSquares2X2 },
    { id: 'Orders',    label: 'Orders',    icon: HiOutlineShoppingCart },
    { id: 'Products',  label: 'Products',  icon: HiOutlineCube },
    { id: 'Category',  label: 'Category',  icon: HiViewColumns },
    { id: 'Stock',     label: 'Stock',     icon: HiOutlineCube },
    { id: 'Customers', label: 'Customers', icon: HiOutlineUsers },
    { id: 'Payments',  label: 'Payments',  icon: HiOutlineCurrencyDollar },
  ];

  return (
    <>
      {isOpen && (
       <div 
        name='overlay' 
        className='fixed inset-0 bg-black/50 z-30 md:hidden'
        onClick={onClose}
        />
      )}

      <aside className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 backdrop-blur-xl shadow-xl flex flex-col z-40 md:static md:translate-x-0 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Logo />
        <Nav_items 
          items={nav_items} 
          CloseSidebar={onClose}
        />
        <User_profile />
      </aside>
    </>
  );
}

export default Sidebar;