import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart as apiAddToCart, clearCart as apiClearCart, removeCartItem as apiRemoveCartItem, updateCartItem as apiUpdateCartItem, getMyCart } from "../services/cartService";
import { useAuth } from "./AuthContext";
import { useToast } from "../contexts/ToastContext";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCart([]);    
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        try {
            const response = await getMyCart();
            if (response && response.data) {
                const cartItems = response.data.items || [];
                const formattedItems = cartItems.map(item => ({
                    id: item.product.Product_Id,
                    title: item.product.Name,
                    price: item.product.Price,
                    cover: item.product.Photo_URL || "https://res.cloudinary.com/dskodfe9c/image/upload/v1766921014/zyjjrcl1qjwatmhiza7b.png",
                    quantity: item.Quantity
                }));
                setCart(formattedItems);
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        }
    };

    const addToCart = async (product) => {
        if (isAuthenticated) {
            try {
                await apiAddToCart(product.id, 1);
                await fetchCart();
                return true;
            } catch (error) {
                console.error("Failed to add to cart:", error);
                toast.error(error.message || 'Failed to add to cart');
                return false;
            }
        } else {
            toast.info('Please login to add items to cart');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
            return false;
        }
    };

    const removeFromCart = async (id) => {
        if (isAuthenticated) {
            try {
                await apiRemoveCartItem(id);
                setCart((prev) => prev.filter((item) => item.product_id !== id)); 
                await fetchCart();
            } catch (error) {
                console.error("Failed to remove from cart:", error);
                toast.error('Failed to remove item from cart');
            }
        }
    };

    const updateQuantity = async (id, quantity) => {
        if (isAuthenticated) {
            try {
                await apiUpdateCartItem(id, quantity);
                await fetchCart();
                toast.success('Cart updated successfully');
            } catch (error) {
                console.error("Failed to update quantity:", error);
                toast.error('Failed to update cart');
            }
        }
    };


    const clearCart = async () => {
        if (isAuthenticated) {
             try {
                await apiClearCart();
                setCart([]);
                console.log("Cart cleared successfully");
            } catch (error) {
                console.error("Failed to clear cart:", error);
                toast.error('Failed to clear cart');
            }
        } else {
            setCart([]);
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
