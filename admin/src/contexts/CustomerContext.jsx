import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useStoreContext } from './StoreContext.jsx';

const CustomerContext = createContext(null);

export const CustomerContextProvider = (props) => {
  const { API, token } = useStoreContext();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState('');

  const fetchCustomers = async () => {
    try {
      let url = '';
      if (searchFilter !== '') {
        url = `${API}users/?search=${searchFilter}&limit=${limit}&page=${page}`;
      } else {
        url = `${API}users/?limit=${limit}&page=${page}`;
      }

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };

      const response = await axios.request(config);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, limit, token, searchFilter]);

  const handleUpdateCustomer = async (user) => {
    try {
      const id = user.User_Id || user.id || user._id;
      const config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${API}users/${id}`,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        data: JSON.stringify(user),
      };
      const response = await axios.request(config);
      if (response.status === 200) {
        toast.success('Customer updated');
        await fetchCustomers();
        return response.data;
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Failed to update customer');
    } finally {
      setSelectedCustomer(null);
    }
  };

  const handleDeleteCustomer = async (user) => {
    try {
      const id = user.User_Id || user.id || user._id;
      const config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `${API}users/${id}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };
      const response = await axios.request(config);
      if (response.status === 200 || response.status === 204) {
        toast.success('Customer deleted');
        await fetchCustomers();
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    } finally {
      setSelectedCustomer(null);
    }
  };

  const contextValue = {
    customers,
    selectedCustomer,
    setSelectedCustomer,
    fetchCustomers,
    handleUpdateCustomer,
    handleDeleteCustomer,
    // pagination
    page,
    setPage,
    limit,
    setLimit,
    searchFilter,
    setSearchFilter,
  };

  return (
    <CustomerContext.Provider value={contextValue}>
      {props.children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomerContext must be used within a CustomerContextProvider');
  }
  return context;
};

export default CustomerContextProvider;
