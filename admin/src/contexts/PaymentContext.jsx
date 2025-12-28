import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useStoreContext } from './StoreContext.jsx';

const PaymentContext = createContext(null);

export const PaymentContextProvider = (props) => {
  const { API, token } = useStoreContext();

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [payments, setPayments] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  const fetchPayments = async () => {
    try {
      let url = `${API}payments?limit=${limit}&page=${page}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (userFilter) url += `&userId=${userFilter}`;

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };

      const response = await axios.request(config);
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to fetch payments');
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page, limit, token, statusFilter, userFilter]);

  const handleUpdatePayment = async (payment) => {
    try {
      const config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${API}payments/${payment.Payment_Id}`,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        data: JSON.stringify(payment),
      };
      const response = await axios.request(config);
      if (response.status === 200) {
        toast.success('Payment updated');
        await fetchPayments();
        return response.data;
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Failed to update payment');
    } finally {
      setSelectedPayment(null);
    }
  };

  const handleDeletePayment = async (payment) => {
    try {
      const config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `${API}payments/${payment.Payment_Id}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };
      const response = await axios.request(config);
      if (response.status === 200 || response.status === 204) {
        toast.success('Payment deleted');
        await fetchPayments();
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast.error('Failed to delete payment');
    } finally {
      setSelectedPayment(null);
    }
  };

  const contextValue = {
    payments,
    selectedPayment,
    setSelectedPayment,
    fetchPayments,
    handleUpdatePayment,
    handleDeletePayment,
    // pagination & filters
    page,
    setPage,
    limit,
    setLimit,
    statusFilter,
    setStatusFilter,
    userFilter,
    setUserFilter,
  };

  return (
    <PaymentContext.Provider value={contextValue}>
      {props.children}
    </PaymentContext.Provider>
  );
};

export const usePaymentContext = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePaymentContext must be used within a PaymentContextProvider');
  }
  return context;
};
