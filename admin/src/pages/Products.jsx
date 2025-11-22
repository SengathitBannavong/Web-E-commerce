import axios from 'axios';
import { useEffect, useState } from 'react';
import { HiListBullet, HiSquares2X2, HiViewColumns } from 'react-icons/hi2';
import BoardView from '../components/views/BoardView.jsx';
import GridView from '../components/views/GridView.jsx';
import TableView from '../components/views/TableView.jsx';

function Products() {
  const [viewMode, setViewMode] = useState('table'); // 'table', 'grid', or 'board'

  const [products, setProducts] = useState([]);

  useEffect(() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:8000/products/',
      headers: { }
    };

    axios.request(config)
    .then((response) => {
      setProducts(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  const columns = [
    { key: 'Index', label: 'Index' },
    { key: 'Product_Id', label: 'Product ID' },
    { key: 'Name', label: 'Name' },
    { key: 'Description', label: 'Description' },
    { key: 'Price', label: 'Price' },
    { key: 'Photo_Id', label: 'Photo ID' },
    { key: 'Category_Id', label: 'Category' },
    { key: 'create_at', label: 'Created At' },
  ];

  const viewButtons = [
    { mode: 'table', icon: HiViewColumns, label: 'Table' },
    { mode: 'grid', icon: HiSquares2X2, label: 'Grid' },
    { mode: 'board', icon: HiListBullet, label: 'Board' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Products</h1>
          <p className="text-gray-600">Manage products here</p>
        </div>
        
        <div className="flex gap-2 bg-white rounded-lg shadow-sm p-1">
          {viewButtons.map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                viewMode === mode
                  ? 'bg-[#FEE2AD] text-black'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={label}
            >
              <Icon className="text-xl" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {viewMode === 'table' && <TableView data={products} columns={columns} />}
        {viewMode === 'grid' && <GridView data={products} />}
        {viewMode === 'board' && <BoardView data={products} />}
      </div>
    </div>
  );
}

export default Products;