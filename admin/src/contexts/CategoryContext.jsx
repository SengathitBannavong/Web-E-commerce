import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useStoreContext } from './StoreContext.jsx';

const CategoryContext = createContext(null);

export const CategoryContextProvider = (props) => {
  const { API, token } = useStoreContext();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const fetchCategories = async () => {
    let url = `${API}categories/?limit=${limit}&page=${page}`;
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    try {
      const response = await axios.request(config);

      // normalize response data to array
      const resData = response.data || {};
      let dataArray = Array.isArray(resData) ? resData : (resData.data && Array.isArray(resData.data) ? resData.data : []);

      // client-side search by name (case-insensitive)
      if (searchName && searchName.trim() !== '') {
        const q = searchName.trim().toLowerCase();
        dataArray = dataArray.filter((c) => (c.Name || '').toLowerCase().includes(q));
      }

      // client-side sort by Category_Id (numeric)
      if (sortOrder === 'asc') {
        dataArray.sort((a, b) => (Number(a.Category_Id) || 0) - (Number(b.Category_Id) || 0));
      } else {
        dataArray.sort((a, b) => (Number(b.Category_Id) || 0) - (Number(a.Category_Id) || 0));
      }

      // preserve original response shape but replace data with filtered/sorted and adjust total
      const adjusted = {
        ...resData,
        data: dataArray,
        total: dataArray.length,
        totalPage: Math.max(1, Math.ceil(dataArray.length / limit)),
      };

      setCategories(adjusted);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, limit, token, searchName, sortOrder]);

  const handleAddCategory = async (formData) => {
    try {
      const payload = {
        name: formData.Name,
        description: formData.Description,
        photoId: formData.Photo_Id || null,
      };
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${API}categories/`,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        data: JSON.stringify(payload),
      };
      const response = await axios.request(config);
      if (response.status === 201) {
        toast.success('Category added successfully!');
        await fetchCategories();
        return response.data;
      }
    } catch (error) {
      toast.error('Failed to add category:' + (error.response?.data?.error || error.message));
    }
  };

  const handleUpdateCategory = async (formData) => {
    try {
      const payload = {
        name: formData.Name,
        description: formData.Description,
        photoId: formData.Photo_Id || null,
      };
      const id = formData.Category_Id || (selectedCategory && selectedCategory.Category_Id);
      if (!id) {
        toast.error('Missing category id');
        return;
      }
      const config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${API}categories/${id}`,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        data: JSON.stringify(payload),
      };
      const response = await axios.request(config);
      if (response.status === 200) {
        toast.success('Category updated successfully!');
        await fetchCategories();
        return response.data;
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category.');
    } finally {
      setSelectedCategory(null);
    }
  };

  const handleDeleteCategory = async (category) => {
    try {
      const id = category?.Category_Id;
      if (!id) {
        toast.error('Missing category id');
        return;
      }
      const config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `${API}categories/${id}`,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };
      const response = await axios.request(config);
      if (response.status === 200 || response.status === 204) {
        toast.success('Category deleted successfully!');
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category.');
    } finally {
      setSelectedCategory(null);
    }
  };

  const contextValue = {
    categories,
    selectedCategory,
    setSelectedCategory,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    searchName,
    setSearchName,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    limit,
    setLimit,
    fetchCategories,
  };

  return (
    <CategoryContext.Provider value={contextValue}>
      {props.children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error('useCategoryContext must be used within a CategoryContextProvider');
  return context;
};

export default CategoryContext;
