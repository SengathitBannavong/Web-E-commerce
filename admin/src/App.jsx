import { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Customers from './pages/Customers.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Orders from './pages/Orders.jsx';
import Payments from './pages/Payments.jsx';
import Products from './pages/Products.jsx';
import './toast-custom.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <Router>
      <div className='flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div
          id='main-content'
          className='flex-1 flex flex-col overflow-hidden'
        >
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <div className='flex-1 overflow-auto'>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/payments" element={<Payments />} />
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
    </Router>
  )
}

export default App
