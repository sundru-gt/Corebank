import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Landmark, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900">
              <Landmark className="h-6 w-6 text-black shrink-0" />
              <span className="hidden sm:block">CoreBank</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 max-w-[150px] sm:max-w-xs">
              <UserIcon className="h-4 w-4 shrink-0 text-gray-500" />
              <span className="truncate">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors group flex items-center gap-1"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
