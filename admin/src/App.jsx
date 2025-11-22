import { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Customers from './pages/Customers.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Orders from './pages/Orders.jsx';
import Payments from './pages/Payments.jsx';
import Products from './pages/Products.jsx';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <Router>
      <div className='flex h-screen bg-[#FFFCEC]'>
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
    </Router>
  )
}

export default App
