import React, { useState, useContext } from 'react';
import { Edit, Eye, EyeOff, Plus, Search, Trash2 } from 'lucide-react';
import { MenuContext } from '../context/MenuContext'; // <--- USE THE CONTEXT

const MenuManagement = () => {
  // Get menu items and functions from the shared context
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useContext(MenuContext);

  // eslint-disable-next-line no-unused-vars
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Derive categories dynamically from menu items
  const categories = [...new Set(menuItems.map(item => item.type).filter(Boolean))];
  // eslint-disable-next-line no-unused-vars
  const allergensList = ['Gluten', 'Dairy', 'Nuts', 'Soy', 'Eggs', 'Shellfish'];

  const [formData, setFormData] = useState({});

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '', category: categories[0] || '', price: '', description: '',
      status: 'available', prepTime: '', allergens: [],
      isSpicy: false, isVeg: false, tags: []
    });
    setShowModal(true);
  };
  
  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setShowModal(true);
  };
  
  // eslint-disable-next-line no-unused-vars
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // eslint-disable-next-line no-unused-vars
  const handleAllergenChange = (allergen) => {
    const currentAllergens = formData.allergens || [];
    const newAllergens = currentAllergens.includes(allergen)
      ? currentAllergens.filter(a => a !== allergen)
      : [...currentAllergens, allergen];
    setFormData(prev => ({ ...prev, allergens: newAllergens }));
  };
  
  // eslint-disable-next-line no-unused-vars
  const handleSubmit = () => {
    if (!formData.name || !formData.price) return;
    
    const processedData = {
      ...formData,
      price: parseFloat(formData.price),
      prepTime: formData.prepTime ? `${formData.prepTime} min` : 'N/A',
      rating: formData.rating || 4.0, // Default values
      reviewCount: formData.reviewCount || 0,
    };

    if (editingItem) {
      updateMenuItem(processedData);
    } else {
      addMenuItem(processedData);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteMenuItem(id);
    }
  };

  const toggleStatus = (item) => {
    const updatedStatus = item.status === 'available' ? 'unavailable' : 'available';
    updateMenuItem({ ...item, status: updatedStatus });
  };
  
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.type === filterCategory;
    const matchesStatus = filterStatus === 'all' || (item.status || 'available') === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
          <p className="text-gray-600">Add, edit, and manage all dishes.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2 shadow-md transition-transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text" placeholder="Search menu items..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-orange-500">
            <option value="all">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-orange-500">
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      {/* Menu Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">Item Name</th>
              <th scope="col" className="px-6 py-3">Category</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover"/>
                    {item.name}
                </td>
                <td className="px-6 py-4">{item.type}</td>
                <td className="px-6 py-4 font-semibold">₹{item.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.status || 'available'}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center justify-center gap-2">
                  <button onClick={() => toggleStatus(item)} title={item.status === 'available' ? 'Mark as Unavailable' : 'Mark as Available'}>
                    {item.status === 'available' ? <EyeOff className="w-5 h-5 text-gray-500 hover:text-red-500"/> : <Eye className="w-5 h-5 text-gray-500 hover:text-green-500"/>}
                  </button>
                  <button onClick={() => openEditModal(item)} title="Edit Item">
                    <Edit className="w-5 h-5 text-gray-500 hover:text-blue-500"/>
                  </button>
                  <button onClick={() => handleDelete(item.id)} title="Delete Item">
                    <Trash2 className="w-5 h-5 text-gray-500 hover:text-red-500"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal is omitted for brevity but your existing modal logic should work with the new handlers */}
      {/* Just ensure the form fields in your modal match the state in 'formData' */}

    </div>
  );
};

export default MenuManagement;