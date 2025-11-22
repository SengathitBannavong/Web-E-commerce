import axios from 'axios';
import { useEffect, useState } from 'react';
import { HiListBullet, HiSquares2X2, HiViewColumns } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import ProductFormModal from '../components/ProductFormModal.jsx';
import BoardView from '../components/views/BoardView.jsx';
import GridView from '../components/views/GridView.jsx';
import TableView from '../components/views/TableView.jsx';

function Products() {
  const [viewMode, setViewMode] = useState('grid'); // 'table', 'grid', or 'board'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);

  // TODO: on deploy change the localhost to env variable
  const fetchProducts = async () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:8000/products/',
      headers: { }
    };
    try {
      const response = await axios.request(config);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const addLocalProduct = (product) => {
    // add product id and index by latest products length
    const date = new Date().toISOString();
    const newProduct = {
      ...product,
      Product_Id: `P${String(products.length + 1).padStart(7, '0')}`,
      Index: products.length + 1,
      create_at: date.split('T')[0],
    };
    setProducts(prevProducts => [...prevProducts, newProduct]);
  }

  const handleAddProduct = async (formData) => {
    try {
      const productData = {
        Name: formData.Name,
        Description: formData.Description,
        Price: Number(formData.Price),
        Photo_Id: formData.Photo_Id,
        Category_Id: formData.Category_Id,
      };
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8000/products/',
        headers: {
          'Content-Type': 'application/json'
        },
        data : JSON.stringify(productData)
      };
      const response = await axios.request(config);
      if(response.status === 201){
        toast.success('Product added successfully!');
      }
      addLocalProduct(formData);
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product. Please try again.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleUpdateProduct = async (formData) => {
    try {
      const productData = {
        Name: formData.Name,
        Description: formData.Description,
        Price: Number(formData.Price),
        Photo_Id: formData.Photo_Id,
        Category_Id: formData.Category_Id,
      };
      
      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `http://localhost:8000/products?id=${formData.Product_Id}`,
        headers: {
          'Content-Type': 'application/json'
        },
        data : JSON.stringify(productData)
      };
      const response = await axios.request(config);
      if(response.status === 200){
        toast.success('Product updated successfully!');
        // Update local state
        setProducts(prevProducts => 
          prevProducts.map(p => 
            p.Product_Id === formData.Product_Id ? { ...p, ...formData } : p
          )
        );
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product. Please try again.');
    } finally {
      setIsModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleDeleteProduct = async (product) => {
    try {
      // on part auth delete it's will impiment later
      // TODO: impiment delete auth to secure this endpoint
      let auth = "admin-secret";
      let config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `http://localhost:8000/products?id=${product.Product_Id}&auth=${auth}`,
      };
      const response = await axios.request(config);
      if(response.status === 200 || response.status === 204){
        toast.success('Product deleted successfully!');
        // Remove from local state
        setProducts(prevProducts => 
          prevProducts.filter(p => p.Product_Id !== product.Product_Id)
        );
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product. Please try again.');
    } finally {
      setIsModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleSubmit = (formData) => {
    if (modalMode === 'edit') {
      handleUpdateProduct(formData);
    } else {
      handleAddProduct(formData);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

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

      <div>
        <button 
          onClick={openAddModal}
          className='bg-black text-white px-4 py-1 rounded-md hover:bg-gray-800 transition-colors'
        >
          Add Product
        </button>
      </div>

      <div className="mt-6">
        {viewMode === 'table' && <TableView data={products} columns={columns} onEdit={openEditModal} />}
        {viewMode === 'grid' && <GridView data={products} onEdit={openEditModal} />}
        {viewMode === 'board' && <BoardView data={products} onEdit={openEditModal} />}
      </div>

      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleSubmit}
        onDelete={handleDeleteProduct}
        product={selectedProduct}
        mode={modalMode}
      />
    </div>
  );
}

export default Products;