import { useState } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import { DashboardContextProvider } from './contexts/DashboardContext.jsx';
import { ProductContextProvider } from './contexts/ProductContext.jsx';
import { OrderContextProvider } from './contexts/OrderContext.jsx';
import Customers from './pages/Customers.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Orders from './pages/Orders.jsx';
import Payments from './pages/Payments.jsx';
import Products from './pages/Products.jsx';
import Login from './pages/Login.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './toast-custom.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <AppContent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </Router>
  );
}

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

                <Route path="/customers" element={<Customers />} />
                <Route path="/payments" element={<Payments />} />
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
}

export default App
