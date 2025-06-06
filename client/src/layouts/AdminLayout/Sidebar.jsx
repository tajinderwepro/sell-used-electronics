import { Home, Users, Settings } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-lg hidden md:block">
      <div className="p-6 font-bold text-xl border-b">Admin Panel</div>
      <nav className="p-4 space-y-3 text-gray-700">
        <a href="/dashboard" className="flex items-center gap-2 hover:text-blue-500">
          <Home size={18} /> Dashboard
        </a>
        <a href="/users" className="flex items-center gap-2 hover:text-blue-500">
          <Users size={18} /> Users
        </a>
        <a href="/settings" className="flex items-center gap-2 hover:text-blue-500">
          <Settings size={18} /> Settings
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
