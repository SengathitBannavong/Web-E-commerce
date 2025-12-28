import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Pagination from './Pagination';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return; 

            setLoading(true);
            try {
                const userId = user.User_Id || user.id;
                const res = await getMyOrders(userId, currentPage, limit);
                
                const orderData = res && res.data ? res.data : [];
                setOrders(orderData);
                setTotalPages(res.totalPage || res.totalPages || 1);

            } catch (err) {
                setError("Failed to load orders.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user, currentPage]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (loading && orders.length === 0) return <div className="text-gray-500 text-center py-4">Loading orders...</div>;
    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

    if (orders.length === 0 && !loading) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">You have placed no orders.</p>
                <Link to="/" className="text-blue-500 hover:underline mt-2 inline-block">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-4">
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="p-4 font-semibold text-gray-700">Order ID</th>
                            <th className="p-4 font-semibold text-gray-700">Date</th>
                            <th className="p-4 font-semibold text-gray-700">Status</th>
                            <th className="p-4 font-semibold text-gray-700">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.Order_Id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4 text-blue-600 font-medium">#{order.Order_Id}</td>
                                <td className="p-4">{new Date(order.Date).toLocaleDateString('vi-VN')}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                        ${order.Status === 'completed' || order.Status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                        order.Status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {order.Status.charAt(0).toUpperCase() + order.Status.slice(1)}
                                    </span>
                                </td>
                                <td className="p-4 font-medium">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.Amount || 0)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default OrderList;
