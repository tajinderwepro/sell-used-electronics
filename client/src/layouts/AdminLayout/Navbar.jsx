const Navbar = () => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="text-lg font-semibold">Dashboard</div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Welcome, Admin</span>
        <img
          src="https://via.placeholder.com/32"
          alt="Avatar"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </header>
  );
};

export default Navbar;
