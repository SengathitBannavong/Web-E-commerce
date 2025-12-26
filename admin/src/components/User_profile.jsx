import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../contexts/StoreContext";

function User_profile() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { clearAppToken, adminName, adminEmail } = useStoreContext();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // clear in-memory token from StoreContext
    try {
      clearAppToken();
    } catch (err) {
      // ignore if context not available
    }
    navigate("/login", { replace: true });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      className="relative mt-auto p-4 border-t border-slate-200"
    >
      <div
        tabIndex={0}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <div className="w-10 h-10 flex items-center justify-center relative">
          <img
            className="rounded-full object-cover w-full h-full ring-2 ring-indigo-500/20"
            src="https://avatars.steamstatic.com/8ca65718782d736967caa829fe58ee2a12a19dec_full.jpg"
            alt="User avatar"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-900 font-semibold truncate">{adminName}</p>
          <p className="text-xs text-slate-500 truncate">{adminEmail}</p>
        </div>
      </div>

      {open && (
        <div className="absolute right-4 bottom-16 w-44 bg-white border rounded shadow-md p-2 z-50">
          <div className="px-2 py-1">
            <p className="text-sm text-slate-900 font-semibold truncate">{adminName}</p>
            <p className="text-xs text-slate-500 truncate">{adminEmail}</p>
          </div>
          <div className="mt-2 border-t pt-2">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default User_profile;