import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useStoreContext } from './StoreContext.jsx';

const OrderContext = createContext(null);

export const OrderContextProvider = (props) => {
  const { API, token } = useStoreContext();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  const validStatuses = ["pending", "paid", "cancelled", "processing", "shipped", "delivered"];

  const fetchOrders = async () => {
    try {
      let url = '';
      if (userFilter !== '') {
        url = `${API}orders/admin/${userFilter}?limit=${limit}&page=${page}${statusFilter ? `&status=${statusFilter}` : ''}`;
      } else {
        url = `${API}orders/admin/?limit=${limit}&page=${page}${statusFilter ? `&status=${statusFilter}` : ''}`;
      }

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };

      const response = await axios.request(config);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, limit, token, statusFilter, userFilter]);

  const fetchOrderItems = async (orderId, p = 1, l = 10) => {
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${API}orders/admin/items/${orderId}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error('Error fetching order items:', error);
      toast.error('Failed to fetch order items');
      return null;
    }
  };

  const handleUpdateOrder = async (order) => {
    try {
      const config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${API}orders/admin/${order.Order_Id}`,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        data: JSON.stringify(order),
      };
      console.log("DATA ORDER UPDATE:", order);
      const response = await axios.request(config);
      if (response.status === 200) {
        toast.success('Order updated');
        await fetchOrders();
        return response.data;
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    } finally {
      setSelectedOrder(null);
    }
  };

  const handleDeleteOrder = async (order) => {
    try {
      const config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `${API}orders/admin/${order.Order_Id}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };
      const response = await axios.request(config);
      if (response.status === 200 || response.status === 204) {
        toast.success('Order deleted');
        await fetchOrders();
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    } finally {
      setSelectedOrder(null);
    }
  };

  const handleAddOrderItem = async (orderId, items) => {
    try {
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${API}orders/admin/items/${orderId}`,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        data: JSON.stringify(items),
      };
      const response = await axios.request(config);
      if (response.status === 201 || response.status === 200) {
        toast.success('Order items added');
        await fetchOrders();
        return response.data;
      }
    } catch (error) {
      console.error('Error adding order item:', error);
      toast.error('Failed to add order item');
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      const config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${API}orders/admin/${orderId}`,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        data: JSON.stringify({ Status: 'processing' }),
      };
      const response = await axios.request(config);
      if (response.status === 200) {
        toast.success('Order confirmed successfully');
        await fetchOrders();
        return response.data;
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      toast.error('Failed to confirm order');
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      const config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${API}orders/admin/${orderId}`,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        data: JSON.stringify({ Status: 'cancelled' }),
      };
      const response = await axios.request(config);
      if (response.status === 200) {
        toast.success('Order cancelled successfully');
        await fetchOrders();
        return response.data;
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  };

  const contextValue = {
    orders,
    selectedOrder,
    setSelectedOrder,
    fetchOrders,
    fetchOrderItems,
    handleUpdateOrder,
    handleDeleteOrder,
    handleAddOrderItem,
    handleConfirmOrder,
    handleRejectOrder,
    // pagination
    page,
    setPage,
    limit,
    setLimit,
    statusFilter,
    setStatusFilter,
    userFilter,
    setUserFilter,
    validStatuses,
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {props.children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within an OrderContextProvider');
  }
  return context;
};
