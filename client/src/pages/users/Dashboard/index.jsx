import Heading from "../../../components/ui/Heading";
import { useAuth } from "../../../context/AuthContext";
import UserNavbar from "../../../layouts/GeneralLayout/UserNavbar";

export default function Dashboard() {
  const { user } = useAuth();
  console.log("useruseruseruseruseruser",user);
  return (
    <div className="py-6">
        <Heading className='text-start'>Welcome {user?.name}</Heading>
        <p className="text-gray-600">Here's an overview of your selling activity.</p>
        {/* Add dashboard content like cards, tables, stats here */}
    </div>
  );
}
