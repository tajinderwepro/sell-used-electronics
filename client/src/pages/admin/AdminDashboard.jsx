export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow-lg">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-2xl">125</p>
        </div>
        <div className="bg-white p-4 rounded shadow-lg">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-2xl">320</p>
        </div>
      </div>
    </div>
  );
}
