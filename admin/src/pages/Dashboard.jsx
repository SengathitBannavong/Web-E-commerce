import { HiOutlineCube, HiOutlineCurrencyDollar, HiOutlineShoppingCart, HiOutlineUsers } from 'react-icons/hi2';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import QuickActions from '../components/Dashboard/QuickActions';
import RecentActivity from '../components/Dashboard/RecentActivity';
import StatsGrid from '../components/Dashboard/StatsGrid';

function Dashboard() {
  const stats = [
    { 
      title: 'Total Revenue', 
      value: '$45,231', 
      change: '+20.1%', 
      icon: HiOutlineCurrencyDollar,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50'
    },
    { 
      title: 'Orders', 
      value: '2,345', 
      change: '+15.3%', 
      icon: HiOutlineShoppingCart,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Products', 
      value: '567', 
      change: '+5.2%', 
      icon: HiOutlineCube,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'Customers', 
      value: '8,234', 
      change: '+12.5%', 
      icon: HiOutlineUsers,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50'
    },
  ];

  const quickActions = ['Add Product', 'New Order', 'View Payment', 'Customer'];

  return (
    <div className="p-6">
      <DashboardHeader />
      <StatsGrid stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <QuickActions actions={quickActions} />
      </div>
    </div>
  );
}

export default Dashboard;