import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { HiListBullet, HiSquares2X2, HiViewColumns } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import { useStoreContext } from "./StoreContext.jsx";

const ProductContext = createContext(null);

export const ProductContextProvider = (props) => {
  const { API } = useStoreContext();

  const [viewMode, setViewMode] = useState('grid'); // 'table', 'grid', or 'board'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);


  const columns = [
    { key: 'Index', label: 'Index' },
    { key: 'Product_Id', label: 'Product ID' },
    { key: 'Name', label: 'Name' },
    { key: 'Author', label: 'Author' },
    { key: 'Description', label: 'Description' },
    { key: 'Price', label: 'Price' },
    { key: 'Cover_Url', label: 'Cover URL' },
    { key: 'Category_Id', label: 'Category' },
    { key: 'create_at', label: 'Created At' },
  ];

  const viewButtons = [
    { mode: 'table', icon: HiViewColumns, label: 'Table' },
    { mode: 'grid', icon: HiSquares2X2, label: 'Grid' },
    { mode: 'board', icon: HiListBullet, label: 'Board' },
  ];

  // TODO: on deploy change the localhost to env variable
  const fetchProducts = async () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${API}products/`,
      headers: { }
    };
    try {
      const response = await axios.request(config);
      // Adjust to handle paginated response
      if (response.data && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        // Fallback for old API structure if needed, though likely not necessary
        setProducts(response.data);
      }
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
        Author: formData.Author,
        Description: formData.Description,
        Price: Number(formData.Price),
        Cover_Url: formData.Cover_Url,
        Category_Id: formData.Category_Id,
      };
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${API}products/`,
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
        Author: formData.Author,
        Description: formData.Description,
        Price: Number(formData.Price),
        Cover_Url: formData.Cover_Url,
        Category_Id: formData.Category_Id,
      };
      
      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${API}products?id=${formData.Product_Id}`,
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
        url: `${API}products?id=${product.Product_Id}&auth=${auth}`,
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


  const contextValue = {
    // States
    columns,
    viewButtons,
    viewMode,
    products,
    isModalOpen,
    modalMode,
    selectedProduct,
    // Actions
    setViewMode,
    setIsModalOpen,
    setModalMode,
    setSelectedProduct,
    setProducts,
    handleDeleteProduct,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {props.children}
    </ProductContext.Provider>
  );
}

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductContextProvider");
  }
  return context;
};
