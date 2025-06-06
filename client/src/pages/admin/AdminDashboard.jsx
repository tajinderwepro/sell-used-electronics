import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const {user} = useAuth();
  console.log(user);
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome User</h1>

    </div>
  );
}

