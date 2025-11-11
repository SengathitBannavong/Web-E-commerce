function Nav_items({items, activeItem, onItemClick, CloseSidebar}) {
  return (
    <nav className="flex-col flex-1 py-6 px-4 space-y-2">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === activeItem;
        return (
          <button
            key={item.id}
            onClick={() => {
              onItemClick(item.id);
              CloseSidebar();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg  ${
              isActive ? 'bg-[#F8FAB4] text-black/75' : 'text-black/75 hover:bg-[#F8FAB4]/65'
            }`} 
          >
            <Icon className="text-[#F08787]" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default Nav_items;