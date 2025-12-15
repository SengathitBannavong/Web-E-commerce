import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import BookDetail from "./pages/BookDetail";
import CheckoutPage from "./pages/CheckoutPage";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="cart" element={<Cart/>} />
          <Route path="profile" element={<Account />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="books/:id" element={<BookDetail />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books/:id" element={<BookDetail />} />
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/account" element={<Account />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
