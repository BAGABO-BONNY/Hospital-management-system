import { Bell, Search, Menu, LogOut, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { logout } from '../../utils/auth';
import ProfileModal from './ProfileModal';

interface HeaderProps {
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
  onMenuClick: () => void;
}

export default function Header({ user, onMenuClick }: HeaderProps) {
  const [notifications] = useState([
    { id: 1, message: 'New appointment request' },
    { id: 2, message: 'Medical report available' },
  ]);

  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleProfileUpdate = (updatedData: any) => {
    // Update local storage with new user data
    localStorage.setItem('user', JSON.stringify({ ...user, ...updatedData }));
    // Reload page to reflect changes
    window.location.reload();
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="text-gray-500 lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-4 lg:gap-8">
            <div className="relative max-w-md flex-1">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  name="search"
                  id="search"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                {notifications.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 rounded-full hover:bg-gray-50 p-2"
              >
                <img
                  className="h-8 w-8 rounded-full"
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                />
                <span className="hidden lg:flex lg:items-center">
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </span>
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
              >
                <LogOut className='h-5 w-5' />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userData={user}
        onSave={handleProfileUpdate}
      />
    </>
  );
}