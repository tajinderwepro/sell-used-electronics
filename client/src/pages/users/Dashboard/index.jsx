import Heading from "../../../components/ui/Heading";
import { useAuth } from "../../../context/AuthContext";
import UserNavbar from "../../../layouts/GeneralLayout/UserNavbar";
import DashboardCard from "./DashboardCard";

const dashboardCards = [
  {
    label: 'Total Products',
    count: 1245,
    color: 'from-emerald-500 to-green-400',
  },
  {
    label: 'Approved',
    count: 317,
    color: 'from-cyan-500 to-blue-500',
  },
  {
    label: 'Pending',
    count: 42,
    color: 'from-yellow-400 to-orange-500',
  },
  {
    label: 'Shipped',
    count: '$8,450',
    color: 'from-purple-500 to-pink-500',
  },
  // {
  //   label: 'Low Stock',
  //   count: 7,
  //   color: 'from-red-500 to-rose-500',
  // },
  // {
  //   label: 'New Signups',
  //   count: 29,
  //   color: 'from-indigo-500 to-sky-500',
  // },
];


export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="py-6">
        <Heading className='text-start'>Welcome {user?.name}</Heading>
        <p>Here's an overview of your selling activity.</p>
        <div className="flex flex-wrap gap-4 mt-5">
          {
            dashboardCards.map((card, i) => (
              <div>
                <DashboardCard
                  label={card.label}
                  count={card.count}
                  color={card.color}  
                />
              </div>
            ))
          }
          {/* <DashboardCard /> */}
        </div>
        {/* Add dashboard content like cards, tables, stats here */}
    </div>
  );
}
