import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const {user} = useAuth();
  console.log(user);
  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome {user?.name}</h1>

    </div>
  );
}

