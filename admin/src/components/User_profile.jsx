function User_profile() {
  return (
    <div className="mt-auto p-4 border-t border-slate-200">
      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
        <div className="w-10 h-10 flex items-center justify-center relative">
          <img 
            className="rounded-full object-cover w-full h-full ring-2 ring-indigo-500/20"
            src="https://avatars.steamstatic.com/8ca65718782d736967caa829fe58ee2a12a19dec_full.jpg"
            alt="User avatar"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-900 font-semibold truncate">Jerry Chadolf</p>
          <p className="text-xs text-slate-500 truncate">Admin</p>
        </div>
      </div>
    </div>
  );
}


export default User_profile;