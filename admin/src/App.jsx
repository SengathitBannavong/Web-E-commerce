import { useState } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Sidebar from './components/Sidebar.jsx';
import { CategoryContextProvider } from './contexts/CategoryContext.jsx';
import { CustomerContextProvider } from './contexts/CustomerContext.jsx';
import { DashboardContextProvider } from './contexts/DashboardContext.jsx';
import { OrderContextProvider } from './contexts/OrderContext.jsx';
import { PaymentContextProvider } from './contexts/PaymentContext.jsx';
import { ProductContextProvider } from './contexts/ProductContext.jsx';
import { StockContextProvider } from './contexts/StockContext.jsx';
import Category from './pages/Category.jsx';
import Customers from './pages/Customers.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Orders from './pages/Orders.jsx';
import Payments from './pages/Payments.jsx';
import Products from './pages/Products.jsx';
import Stock from './pages/Stock.jsx';
import Reviews from './pages/Reviews.jsx';
import './toast-custom.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <AppContent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </Router>
  );
};

function AppContent({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const hideSidebar = location.pathname === '/login';

  return (
    <>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {!hideSidebar && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <div id="main-content" className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route
                  path="/"
                  element={
                    <DashboardContextProvider>
                      <Dashboard />
                    </DashboardContextProvider>
                  }
                />

                <Route
                  path="/orders"
                  element={
                    <OrderContextProvider>
                      <Orders />
                    </OrderContextProvider>
                  }
                />

                <Route
                  path="/products"
                  element={
                    <ProductContextProvider>
                      <Products />
                    </ProductContextProvider>
                  }
                />

                <Route
                  path="/category"
                  element={
                    <CategoryContextProvider>
                      <Category />
                    </CategoryContextProvider>
                  }
                />
                <Route
                  path="/stock"
                  element={
                    <StockContextProvider>
                      <Stock />
                    </StockContextProvider>
                  }
                />

                <Route
                  path="/customers"
                  element={
                    <CustomerContextProvider>
                      <Customers />
                    </CustomerContextProvider>
                  }
                />
                <Route
                  path="/payments"
                  element={
                    <PaymentContextProvider>
                      <Payments />
                    </PaymentContextProvider>
                  }
                />

                <Route
                  path="/reviews"
                  element={<Reviews />}
                />
              </Route>
            </Routes>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
