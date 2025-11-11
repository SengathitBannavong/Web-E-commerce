import { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className='flex h-screen bg-[#FFFCEC]'>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div
        id='main-content'
        className='flex-1 flex flex-col overflow-hidden'
      >
        <Header onMenuClick={() => setSidebarOpen(true)} />
      </div>
    </div>
  )
}

export default App
