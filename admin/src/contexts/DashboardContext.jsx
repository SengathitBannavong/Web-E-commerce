import axios from 'axios';
import { createContext, useContext, useEffect, useState } from "react";
import {
  HiOutlineCube,
  HiOutlineCurrencyDollar,
  HiOutlineShoppingCart,
  HiOutlineUsers
} from 'react-icons/hi2';
import { useStoreContext } from './StoreContext.jsx';

const DashboardContext = createContext(null);

export const DashboardContextProvider = (props) => {
  const { API, token } = useStoreContext();
  const [stats, setStats] = useState([
    { title: 'Total Revenue', value: 'VND 0', change: '', icon: HiOutlineCurrencyDollar, color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50' },
    { title: 'Orders', value: '0', change: '', icon: HiOutlineShoppingCart, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50' },
    { title: 'Products', value: '0', change: '', icon: HiOutlineCube, color: 'from-purple-500 to-pink-600', bgColor: 'bg-purple-50' },
    { title: 'Customers', value: '0', change: '', icon: HiOutlineUsers, color: 'from-orange-500 to-red-600', bgColor: 'bg-orange-50' },
  ]);
  const [lowStockCount, setLowStockCount] = useState(0);

  const quickActions = ['Add Product', 'New Order', 'View Payment', 'Customer'];

  const fetchStats = async () => {
    try {
      const url = `${API}admin/dashboard`;
      const config = { method: 'get', url, headers: token ? { Authorization: `Bearer ${token}` } : {} };
      const res = await axios.request(config);
      const data = res.data || {};

      const mapped = [
        { title: 'Total Revenue', value: `VND ${Number(data.totalRevenue || 0).toLocaleString()}`, change: '', icon: HiOutlineCurrencyDollar, color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50' },
        { title: 'Orders', value: `${data.totalOrders || 0}`, change: '', icon: HiOutlineShoppingCart, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50' },
        { title: 'Products', value: `${data.totalProducts || 0}`, change: '', icon: HiOutlineCube, color: 'from-purple-500 to-pink-600', bgColor: 'bg-purple-50' },
        { title: 'Customers', value: `${data.totalUsers || 0}`, change: '', icon: HiOutlineUsers, color: 'from-orange-500 to-red-600', bgColor: 'bg-orange-50' },
      ];

      setStats(mapped);
      // low stock count returned by admin dashboard endpoint
      setLowStockCount(typeof data.lowStockCount === 'number' ? data.lowStockCount : 0);
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [API, token]);

  const contextValue = {
    stats,
    quickActions,
    lowStockCount,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {props.children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardContext must be used within a DashboardContextProvider");
  }
  return context;
};