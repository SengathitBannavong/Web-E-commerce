  import { Route, Routes, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ScrollToTop from "./components/ScrollToTop";
import Account from "./pages/Account";
import BookDetailEnhanced from "./pages/BookDetailEnhanced";
import BookList from "./pages/BookList";
import CartEnhanced from "./pages/Cart";
import Categories from "./pages/Categories";
import CheckoutPage from "./pages/CheckoutPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PaymentSuccess from "./pages/PaymentSuccess";
import Register from "./pages/Register";

  function App() {
    return (
      <>
        <ScrollToTop />
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Navigate to="/" replace />} />
            <Route path="categories" element={<Categories />} />
            <Route path="books" element={<BookList />} />
            <Route path="books/:id" element={<BookDetailEnhanced />} />
            
            {/* Public Routes */}
            <Route element={<PublicRoute />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="account" element={<Account />} />
              <Route path="cart" element={<CartEnhanced />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="payment-success" element={<PaymentSuccess />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </>
    );
  }

  export default App;
