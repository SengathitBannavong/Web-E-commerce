const OrderItem = ({ item }) => {
    return (
        <div className="order-item">
            <div className="item-details-full">
                <h5 className="item-name">{item.product?.Name || 'Unknown Product'}</h5>
                <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '150px' }}>
                    <span className="item-quantity">#{item.product?.Product_Id || 'N/A'}</span>
                    <span className="item-quantity">Quantity: {item.Quantity}</span>
                </div>
            </div>
            <div className="item-price">
                {new Intl.NumberFormat('vi-VN', { 
                    style: 'currency', 
                    currency: 'VND' 
                }).format(item.Amount || 0)}
            </div>
        </div>
    );
};

export default OrderItem;
