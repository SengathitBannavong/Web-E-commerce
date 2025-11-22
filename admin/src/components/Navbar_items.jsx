import { Link, useLocation } from 'react-router-dom';

function Nav_items({items, CloseSidebar}) {
  const location = useLocation();

  return (
    <nav className="flex-col flex-1 py-6 px-4 space-y-2">
      {items.map((item) => {
        const Icon = item.icon;
        const path = item.id === 'dashboard' ? '/' : `/${item.id.toLowerCase()}`;
        const isActive = location.pathname === path;
        return (
          <Link
            key={item.id}
            to={path}
            onClick={CloseSidebar}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg  ${
              isActive ? 'bg-[#F8FAB4] text-black/75' : 'text-black/75 hover:bg-[#F8FAB4]/65'
            }`}
          >
            <Icon className="text-[#F08787]" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default Nav_items;