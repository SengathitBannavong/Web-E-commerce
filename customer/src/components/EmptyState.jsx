import { FiPackage, FiSearch, FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './EmptyState.css';

const icons = {
  cart: <FiShoppingCart />,
  search: <FiSearch />,
  orders: <FiPackage />
};

export default function EmptyState({ 
  type = 'cart', 
  title, 
  message, 
  actionText = 'Browse Books',
  actionLink = '/books'
}) {
  const defaultTitles = {
    cart: 'Your cart is empty',
    search: 'No results found',
    orders: 'No orders yet'
  };

  const defaultMessages = {
    cart: 'Add some books to your cart to get started',
    search: 'Try adjusting your search terms',
    orders: 'You haven\'t placed any orders yet'
  };

  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        {icons[type]}
      </div>
      <h3 className="empty-state__title">
        {title || defaultTitles[type]}
      </h3>
      <p className="empty-state__message">
        {message || defaultMessages[type]}
      </p>
      {actionText && actionLink && (
        <Link to={actionLink} className="empty-state__action">
          {actionText}
        </Link>
      )}
    </div>
  );
}
