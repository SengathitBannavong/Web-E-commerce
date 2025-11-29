import DashboardHeader from '../components/Dashboard/DashboardHeader';
import QuickActions from '../components/Dashboard/QuickActions';
import RecentActivity from '../components/Dashboard/RecentActivity';
import StatsGrid from '../components/Dashboard/StatsGrid';
import { useDashboardContext } from '../contexts/DashboardContext';

function Dashboard() {
  const { stats, quickActions } = useDashboardContext();  

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