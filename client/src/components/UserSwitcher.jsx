import { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';

const UserSwitcher = () => {
  const { currentUser, switchUser, allUsers } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <span
          className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
          style={{ backgroundColor: currentUser.color }}
        >
          {currentUser.name.charAt(0)}
        </span>
        <span className="hidden sm:block text-sm font-medium text-slate-700 truncate max-w-[100px]">
          {currentUser.name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-40">
          <p className="px-3 py-1.5 text-xs text-slate-400 uppercase tracking-wide">
            Switch user
          </p>
          {allUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => {
                switchUser(user.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 ${
                user.id === currentUser.id ? 'bg-slate-50' : ''
              }`}
            >
              <span
                className="h-5 w-5 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0"
                style={{ backgroundColor: user.color }}
              >
                {user.name.charAt(0)}
              </span>
              <span className="truncate text-slate-700">{user.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSwitcher;
