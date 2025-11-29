import { createContext, useContext } from "react";
import {
  HiOutlineCube,
  HiOutlineCurrencyDollar,
  HiOutlineShoppingCart,
  HiOutlineUsers
} from 'react-icons/hi2';

const DashboardContext = createContext(null);

export const DashboardContextProvider = (props) => {

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

  const contextValue = {
    stats,
    quickActions,
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