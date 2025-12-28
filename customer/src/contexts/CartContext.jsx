import { createContext, useContext, useState, useEffect } from "react";
import { getMyCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeCartItem as apiRemoveCartItem, clearCart as apiClearCart } from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const { isAuthenticated } = useAuth();

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
                    cover: item.product.Photo_Id,
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
                alert(`Failed to add to cart: ${error.message}`);
                return false;
            }
        } else {
            alert("Please login to add items to cart");
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
            }
        }
    };

    const updateQuantity = async (id, quantity) => {
        if (isAuthenticated) {
            try {
                await apiUpdateCartItem(id, quantity);
                 await fetchCart();
            } catch (error) {
                console.error("Failed to update quantity:", error);
            }
        }
    };


    const clearCart = async () => {
        if (isAuthenticated) {
             try {
                await apiClearCart();
                setCart([]);
            } catch (error) {
                console.error("Failed to clear cart:", error);
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
