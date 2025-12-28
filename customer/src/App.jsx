  import { Route, Routes } from "react-router-dom";
  import AppLayout from "./components/AppLayout";
  import Home from "./pages/Home";
  import Login from "./pages/Login";
  import Register from "./pages/Register";
  import Cart from "./pages/Cart";
  import Account from "./pages/Account";
  import BookDetail from "./pages/BookDetail";
  import BookList from "./pages/BookList";
  import CheckoutPage from "./pages/CheckoutPage";
  import { AuthProvider } from "./contexts/AuthContext";
  import ProtectedRoute from "./components/ProtectedRoute";
  import PublicRoute from "./components/PublicRoute";

  function App() {
    return (
      <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="books" element={<BookList />} />
            <Route path="books/:id" element={<BookDetail />} />
            {/* Public Routes */}
            <Route element={<PublicRoute />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="account" element={<Account />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<CheckoutPage />} />
            </Route>
          </Route>
        </Routes>
    );
  }

  export default App;
