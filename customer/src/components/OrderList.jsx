import { useEffect, useState } from 'react';
import { FaBox, FaCalendar, FaMapMarkerAlt, FaReceipt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMyOrders, getOrderById } from '../services/orderService';
import OrderItem from './OrderItem';
import './OrderList.css';
import Pagination from './Pagination';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState({});
    const [loadingDetails, setLoadingDetails] = useState({});

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

    const toggleOrderDetails = async (orderId) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
            return;
        }

        setExpandedOrder(orderId);

        // Fetch order details if not already loaded
        if (!orderDetails[orderId]) {
            setLoadingDetails((prev) => ({ ...prev, [orderId]: true }));
            try {
                const response = await getOrderById(orderId);
                const details = response.data || response;
                setOrderDetails((prev) => ({ ...prev, [orderId]: details }));
            } catch (err) {
                console.error('Failed to load order details:', err);
            } finally {
                setLoadingDetails((prev) => ({ ...prev, [orderId]: false }));
            }
        }
    };

    const getStatusColor = (status) => {
        const normalizedStatus = status?.toLowerCase() || '';
        if (normalizedStatus === 'completed' || normalizedStatus === 'delivered') return 'success';
        if (normalizedStatus === 'cancelled') return 'danger';
        if (normalizedStatus === 'pending') return 'warning';
        return 'info';
    };

    if (loading && orders.length === 0) {
        return (
            <div className="order-list-loading">
                <div className="spinner-large"></div>
                <p>Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-list-error">
                <p>{error}</p>
            </div>
        );
    }

    if (orders.length === 0 && !loading) {
        return (
            <div className="order-list-empty">
                <FaBox className="empty-icon" />
                <h3>No orders yet</h3>
                <p>You haven't placed any orders yet.</p>
                <Link to="/books" className="btn-primary">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="order-list">
            <div className="orders-container">
                {orders.map((order) => (
                    <div key={order.Order_Id} className="order-card">
                        <div className="order-header" onClick={() => toggleOrderDetails(order.Order_Id)}>
                            <div className="order-info">
                                <div className="order-id">
                                    <FaReceipt />
                                    <span>Order #{order.Order_Id}</span>
                                </div>
                                <div className="order-date">
                                    <FaCalendar />
                                    <span>{new Date(order.Date).toLocaleDateString('en-EN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</span>
                                </div>
                            </div>
                            <div className="order-meta">
                                <span className={`order-status status-${getStatusColor(order.Status)}`}>
                                    {order.Status?.charAt(0).toUpperCase() + order.Status?.slice(1)}
                                </span>
                                <div className="order-total">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.Amount || 0)}
                                </div>
                                <button className="toggle-btn">
                                    {expandedOrder === order.Order_Id ? <span>Show less</span> : <span>Show more</span>}
                                </button>
                            </div>
                        </div>

                        {expandedOrder === order.Order_Id && (
                            <div className="order-details">
                                {loadingDetails[order.Order_Id] ? (
                                    <div className="details-loading">
                                        <div className="spinner-small"></div>
                                        <p>Loading order details...</p>
                                    </div>
                                ) : orderDetails[order.Order_Id] ? (
                                    <>
                                        {/* Shipping Address */}
                                        <div className="detail-section">
                                            <h4 className="detail-title">
                                                <FaMapMarkerAlt /> Shipping Address
                                            </h4>
                                            <p className="detail-text">
                                                {orderDetails[order.Order_Id].Shipping_Address || 'N/A'}
                                            </p>
                                        </div>

                                    {/* Order Items */}
                                    {orderDetails[order.Order_Id].items && orderDetails[order.Order_Id].items.length > 0 && (
                                      <div className="detail-section">
                                        <h4 className="detail-title">
                                          <FaBox /> Order Items
                                        </h4>
                                        <div className="order-items">
                                          {orderDetails[order.Order_Id].items.map((item, index) => (
                                            <OrderItem key={index} item={item} />
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    {/* Payment Info */}
                                    {orderDetails[order.Order_Id].Payment && (
                                        <div className="detail-section">
                                            <h4 className="detail-title">Payment Information</h4>
                                            <div className="payment-info">
                                                <div className="info-row">
                                                    <span>Method:</span>
                                                    <span className="info-value">
                                                        {orderDetails[order.Order_Id].Payment.Method || 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="info-row">
                                                    <span>Status:</span>
                                                    <span className={`payment-status status-${getStatusColor(orderDetails[order.Order_Id].Payment.Status)}`}>
                                                        {orderDetails[order.Order_Id].Payment.Status || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                                ) : (
                                    <p className="detail-text">No details available</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
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
