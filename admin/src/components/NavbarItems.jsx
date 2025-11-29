import { Link, useLocation } from 'react-router-dom';

function Nav_items({items, CloseSidebar}) {
  const location = useLocation();

  return (
    <nav className="flex-col flex-1 py-6 px-3 space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const path = item.id === 'dashboard' ? '/' : `/${item.id.toLowerCase()}`;
        const isActive = location.pathname === path;
        return (
          <Link
            key={item.id}
            to={path}
            onClick={CloseSidebar}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              isActive 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
              isActive ? 'text-white' : 'text-slate-500'
            }`} />
            <span className={`font-medium text-sm ${
              isActive ? 'text-white' : ''
            }`}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default Nav_items;