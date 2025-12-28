import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useStoreContext } from "./StoreContext.jsx";

const ProductContext = createContext(null);

export const ProductContextProvider = (props) => {
  const { API, token } = useStoreContext();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');


  const fetchProducts = async () => {
    console.log("Fetching products...");
    let url = `${API}products/?limit=${limit}&page=${page}`;
    if (categoryFilter) {
      url += `&category=${encodeURIComponent(categoryFilter)}`;
    }

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
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
  }, [page, limit, token, categoryFilter]);

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
        Photo_Id: formData.Photo_Id,
        Photo_URL: formData.Photo_URL,
        Category_Id: formData.Category_Id === 0 ? null : formData.Category_Id,
      };
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${API}products/`,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        data : JSON.stringify(productData)
      };
      const response = await axios.request(config);
      if (response.status === 201) {
        toast.success('Product added successfully!');
        await fetchProducts();
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product:' + (error.response?.data?.error || error.message));
    }
  };

  const handleUpdateProduct = async (formData) => {
    try {
      const productData = {
        Name: formData.Name,
        Author: formData.Author,
        Description: formData.Description,
        Price: Number(formData.Price),
        Photo_Id: formData.Photo_Id,
        Category_Id: formData.Category_Id,
      };
      
      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${API}products/${formData.Product_Id}`,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        data : JSON.stringify(productData)
      };
      const response = await axios.request(config);
      if(response.status === 200){
        toast.success('Product updated successfully!');
        await fetchProducts();
        return response.data;
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product. Please try again.');
    } finally {
      setSelectedProduct(null);
    }
  };

  const handleDeleteProduct = async (product) => {
    try {
      let config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `${API}products/${product.Product_Id}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };
      const response = await axios.request(config);
      if(response.status === 200 || response.status === 204){
        toast.success('Product deleted successfully!');
        await fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product. Please try again.');
    } finally {
      setSelectedProduct(null);
    }
  };

  // Upload image (if provided) and create/update product accordingly
  const submitProductImage = async ({image_form, productId}) => {
    if (image_form) {
      const formData = new FormData();
      formData.append('image', image_form);
      formData.append('productId', productId);
    

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${API}products/upload-image`,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'multipart/form-data',
        },
        data : formData
      };

      try {
        const response = await axios.request(config);
        if (response.status === 200) {
          return response.data;
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image. Please try again.');
        return null;
      }
    }else {
      // for deleting image case
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${API}products/delete-image`,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        data : JSON.stringify({ productId })
      };

      try {
        const response = await axios.request(config);
        if (response.status === 200) {
          return { imageUrl: null };
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        toast.error('Failed to delete image. Please try again.');
        return null;
      }
    }
    return null;
  };

  const contextValue = {
    products,
    selectedProduct,
    setSelectedProduct,
    setProducts,
    handleDeleteProduct,
    handleAddProduct,
    handleUpdateProduct,
    submitProductImage,
    // pagination
    page,
    setPage,
    limit,
    setLimit,
    categoryFilter,
    setCategoryFilter,
    fetchProducts,
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
