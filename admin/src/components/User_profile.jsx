function User_profile() {
  return (
    <div className="h-16 border-t border-[#F08787]/25 flex items-center gap-3 px-4">
      {/* User Avatar Placeholder */}
      <div className="w-10 h-10 flex items-center justify-center">
        <img 
          className="rounded-full object-cover"
          src="https://avatars.steamstatic.com/8ca65718782d736967caa829fe58ee2a12a19dec_full.jpg"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-black font-medium truncate">Jerry Chadolf</p>
        <p className="text-xs text-black/50 truncate">Admin</p>
      </div>
    </div>
  );
}


export default User_profile;