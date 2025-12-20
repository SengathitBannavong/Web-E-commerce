import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useStoreContext } from './StoreContext.jsx';

const StockContext = createContext(null);

export const StockContextProvider = (props) => {
  const { API, token } = useStoreContext();
  const [stocks, setStocks] = useState([]);
  const [allStocks, setAllStocks] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [minQuantity, setMinQuantity] = useState('');
  const [maxQuantity, setMaxQuantity] = useState('');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const fetchStocks = async () => {
    const url = `${API}stocks/?limit=${limit}&page=${page}`;
    const config = { method: 'get', maxBodyLength: Infinity, url, headers: token ? { Authorization: `Bearer ${token}` } : {} };
    try {
      const response = await axios.request(config);
      const resData = response.data || {};
      let dataArray = Array.isArray(resData) ? resData : (resData.data && Array.isArray(resData.data) ? resData.data : []);

      // store raw API result and compute filtered view separately
      const adjusted = { ...resData, data: dataArray };
      setAllStocks(adjusted);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  useEffect(() => { fetchStocks(); }, [page, limit, token]);

  // compute client-side filtered/sorted stocks from allStocks
  useEffect(() => {
    const resData = allStocks || {};
    let dataArray = Array.isArray(resData) ? resData : (resData.data && Array.isArray(resData.data) ? resData.data : []);

    // apply quantity filters (client-side only)
    const minQ = minQuantity === '' ? null : Number(minQuantity);
    const maxQ = maxQuantity === '' ? null : Number(maxQuantity);
    if (minQ !== null) {
      dataArray = dataArray.filter(item => (Number(item.Quantity) || 0) >= minQ);
    }
    if (maxQ !== null) {
      dataArray = dataArray.filter(item => (Number(item.Quantity) || 0) <= maxQ);
    }

    const adjusted = { ...resData, data: dataArray, total: dataArray.length, totalPage: Math.max(1, Math.ceil((dataArray.length || 0) / (limit || 1))) };
    setStocks(adjusted);
  }, [allStocks, minQuantity, maxQuantity, limit]);

  const handleUpsertStock = async (formData) => {
    try {
      const payload = {
        productId: formData.Product_Id,
        quantity: Number(formData.Quantity),
      };
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${API}stocks/`,
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        data: JSON.stringify(payload),
      };
      const response = await axios.request(config);
      if (response.status === 201 || response.status === 200) {
        toast.success(response.data?.message || 'Stock saved');
        await fetchStocks();
        return response.data;
      }
    } catch (error) {
      console.error('Error upserting stock:', error);
      toast.error('Failed to save stock');
    }
  };

  const handleDeleteStock = async (stock) => {
    try {
      const productId = stock?.Product_Id;
      if (!productId) { toast.error('Missing product id'); return; }
      const config = { method: 'delete', maxBodyLength: Infinity, url: `${API}stocks/${productId}`, headers: token ? { Authorization: `Bearer ${token}` } : {} };
      const response = await axios.request(config);
      if (response.status === 200 || response.status === 204) {
        toast.success('Stock deleted');
        await fetchStocks();
      }
    } catch (error) {
      console.error('Error deleting stock:', error);
      toast.error('Failed to delete stock');
    } finally { setSelectedStock(null); }
  };

  const contextValue = {
    stocks,
    allStocks,
    selectedStock,
    setSelectedStock,
    handleUpsertStock,
    handleDeleteStock,
    minQuantity,
    setMinQuantity,
    maxQuantity,
    setMaxQuantity,
    page,
    setPage,
    limit,
    setLimit,
    fetchStocks,
  };

  return (
    <StockContext.Provider value={contextValue}>
      {props.children}
    </StockContext.Provider>
  );
};

export const useStockContext = () => {
  const context = useContext(StockContext);
  if (!context) throw new Error('useStockContext must be used within a StockContextProvider');
  return context;
};

export default StockContext;
