import {
  Award,
  Bell,
  Calendar,
  Camera,
  Clock,
  Edit3,
  Heart,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  User,
  X
} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch user orders
  const fetchUserOrders = async () => {
    setLoadingOrders(true);
    try {
  const res = await api.get('/orders/my');
  setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch orders when component mounts
  useEffect(() => {
    fetchUserOrders();
  }, []);

  // Update profile data when user data changes
  useEffect(() => {
    if (user) {
      setProfileData(prevData => ({
        ...prevData,
        name: user.name || prevData.name,
        email: user.email || prevData.email,
        phone: user.phone || prevData.phone,
        address: user.address || prevData.address,
        dateOfBirth: user.dateOfBirth || prevData.dateOfBirth,
        joinedDate: user.createdAt || prevData.joinedDate
      }));
    }
  }, [user]);
  // Initialize profile data from user context
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    dateOfBirth: user?.dateOfBirth || '',
    joinedDate: user?.createdAt || new Date().toISOString(),
    preferences: user?.preferences || {
      cuisine: [],
      dietary: [],
      spiceLevel: 'Medium'
    },
    stats: {
      totalOrders: orders.length || 0,
      favoriteItems: user?.favorites?.length || 0,
      reviewsGiven: user?.reviews?.length || 0,
      loyaltyPoints: user?.loyaltyPoints || 0
    }
  });

  const [editData, setEditData] = useState({ ...profileData });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const { updateUser } = useContext(AuthContext);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        alert('You must be logged in to update your profile. Please log in again.');
        return;
      }

      // Validate required fields
      if (!editData.name || !editData.email) {
        alert('Name and email are required fields.');
        return;
      }

      console.log('Attempting to save profile with data:', editData);

      // Check if server is running
      // Optional: check server health via /test
      try {
        await api.get('/test');
      } catch (error) {
        alert('Cannot connect to the server. Please ensure the server is running.');
        return;
      }

      // Log the token for debugging
      console.log('Using token:', token);
      
  await api.put('/auth/update-profile', {
        name: editData.name.trim(),
        email: editData.email.trim(),
        phone: editData.phone ? editData.phone.trim() : '',
        address: editData.address ? editData.address.trim() : '',
        dateOfBirth: editData.dateOfBirth || null
      });


      setProfileData(prevData => ({
        ...prevData,
        ...editData
      }));
      updateUser(editData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Error updating profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...profileData });
  };

  const handleInputChange = (field, value) => {
    console.log('Updating field:', field, 'with value:', value);
    setEditData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      console.log('New edit data:', newData);
      return newData;
    });
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'orders', label: 'My Orders', icon: Clock },
    { id: 'preferences', label: 'Preferences', icon: Heart },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  // Use real orders from backend, fallback to empty array if no orders
  const recentOrders = orders.slice(0, 3); // Show only the 3 most recent orders

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="container">
          <div className="header-content">
            <div className="profile-avatar-section">
              <div className="avatar-container">
                <div className="profile-avatar">
                  <User size={48} />
                </div>
                <button className="avatar-edit-btn">
                  <Camera size={16} />
                </button>
              </div>
              <div className="profile-info">
                <h1>{profileData.name}</h1>
                <p className="member-since">
                  <Calendar size={16} />
                  Member since {new Date(profileData.joinedDate).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
                <div className="profile-badges">
                  <span className="badge gold">
                    <Award size={14} />
                    Gold Member
                  </span>
                  <span className="badge verified">
                    <Shield size={14} />
                    Verified
                  </span>
                </div>
              </div>
            </div>
            
            <div className="profile-stats">
              <div className="stat-card">
                <div className="stat-number">{orders.length}</div>
                <div className="stat-label">Total Orders</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{user?.favorites?.length || 0}</div>
                <div className="stat-label">Favorites</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{user?.reviews?.length || 0}</div>
                <div className="stat-label">Reviews</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{user?.loyaltyPoints || 0}</div>
                <div className="stat-label">Points</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        <div className="container">
          <div className="content-layout">
            {/* Sidebar Navigation */}
            <div className="profile-sidebar">
              <nav className="profile-nav">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <Icon size={20} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>

              {/* Recent Orders */}
              <div className="recent-orders">
                <div className="orders-header">
                  <h3>Recent Orders</h3>
                  {orders.length > 3 && (
                    <button 
                      className="view-all-orders-btn"
                      onClick={() => setActiveTab('orders')}
                    >
                      View All
                    </button>
                  )}
                </div>
                {loadingOrders ? (
                  <div className="orders-loading">
                    <p>Loading orders...</p>
                  </div>
                ) : recentOrders.length > 0 ? (
                  <div className="orders-list">
                    {recentOrders.map(order => (
                      <div key={order._id} className="order-item">
                        <div className="order-date">
                          <Clock size={14} />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="order-items">
                          {order.items.slice(0, 2).map(item => item.name).join(', ')}
                          {order.items.length > 2 && ` +${order.items.length - 2} more`}
                        </div>
                        <div className="order-total">₹{order.total}</div>
                        <div className="order-status">
                          <span className={`status-badge ${order.status}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-orders">
                    <p>No orders yet</p>
                    <p className="order-cta">Start ordering to see your history here!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="profile-main">
              {activeTab === 'personal' && (
                <div className="tab-content">
                  <div className="section-header">
                    <h2>Personal Information</h2>
                    {!isEditing ? (
                      <button 
                        className="edit-btn" 
                        onClick={handleEdit}
                      >
                        <Edit3 size={16} />
                        Edit Profile
                      </button>
                    ) : (
                      <div className="edit-actions">
                        <button 
                          className="save-btn"
                          onClick={handleSave}
                          disabled={!editData.name || !editData.email} // Disable if required fields are empty
                        >
                          <Save size={16} />
                          Save Changes
                        </button>
                        <button 
                          className="cancel-btn" 
                          onClick={handleCancel}
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>
                        <User size={16} />
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                      ) : (
                        <div className="form-value">{profileData.name}</div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>
                        <Mail size={16} />
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      ) : (
                        <div className="form-value">{profileData.email}</div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>
                        <Phone size={16} />
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      ) : (
                        <div className="form-value">{profileData.phone}</div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>
                        <Calendar size={16} />
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        />
                      ) : (
                        <div className="form-value">
                          {new Date(profileData.dateOfBirth).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="form-group full-width">
                      <label>
                        <MapPin size={16} />
                        Address
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          rows="3"
                        />
                      ) : (
                        <div className="form-value">{profileData.address}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="tab-content">
                  <div className="section-header">
                    <h2>My Orders</h2>
                    <button 
                      className="refresh-btn"
                      onClick={fetchUserOrders}
                      disabled={loadingOrders}
                    >
                      <Clock size={16} />
                      {loadingOrders ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>

                  {loadingOrders ? (
                    <div className="orders-loading">
                      <p>Loading your orders...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="orders-grid">
                      {orders.map(order => (
                        <div key={order._id} className="order-card">
                          <div className="order-header">
                            <div className="order-id">
                              Order #{order._id.slice(-6).toUpperCase()}
                            </div>
                            <div className="order-date">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                          
                          <div className="order-items">
                            <h4>Items:</h4>
                            <ul>
                              {order.items.map((item, index) => (
                                <li key={index}>
                                  {item.name} x{item.quantity} - ₹{item.price}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="order-footer">
                            <div className="order-total">
                              <strong>Total: ₹{order.total}</strong>
                            </div>
                            <div className="order-status">
                              <span className={`status-badge ${order.status}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-orders">
                      <h3>No Orders Yet</h3>
                      <p>You haven't placed any orders yet.</p>
                      <p className="order-cta">Start ordering from our delicious menu!</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="tab-content">
                  <div className="section-header">
                    <h2>Food Preferences</h2>
                    {!isEditing ? (
                      <button 
                        className="edit-btn" 
                        onClick={handleEdit}
                      >
                        <Edit3 size={16} />
                        Edit Preferences
                      </button>
                    ) : (
                      <div className="edit-actions">
                        <button 
                          className="save-btn"
                          onClick={handleSave}
                        >
                          <Save size={16} />
                          Save Changes
                        </button>
                        <button 
                          className="cancel-btn" 
                          onClick={handleCancel}
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="preferences-grid">
                    <div className="preference-group">
                      <h3>Favorite Cuisines</h3>
                      <div className="preference-tags">
                        {(user?.preferences?.cuisine || []).length > 0 ? (
                          user.preferences.cuisine.map(cuisine => (
                            <span key={cuisine} className="preference-tag">
                              {cuisine}
                            </span>
                          ))
                        ) : (
                          <p className="no-preferences">No cuisine preferences set</p>
                        )}
                      </div>
                    </div>

                    <div className="preference-group">
                      <h3>Dietary Restrictions</h3>
                      <div className="preference-tags">
                        {(user?.preferences?.dietary || []).length > 0 ? (
                          user.preferences.dietary.map(diet => (
                            <span key={diet} className="preference-tag dietary">
                              {diet}
                            </span>
                          ))
                        ) : (
                          <p className="no-preferences">No dietary restrictions set</p>
                        )}
                      </div>
                    </div>

                    <div className="preference-group">
                      <h3>Spice Level</h3>
                      <div className="spice-level">
                        <span className={`spice-indicator ${user?.preferences?.spiceLevel?.toLowerCase() || 'medium'}`}>
                          {user?.preferences?.spiceLevel || 'Medium'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="tab-content">
                  <div className="section-header">
                    <h2>Security Settings</h2>
                  </div>

                  <div className="security-options">
                    <div className="security-item">
                      <div className="security-info">
                        <h3>Password</h3>
                        <p>Last changed: {user?.lastPasswordChange 
                          ? new Date(user.lastPasswordChange).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'Never'}</p>
                      </div>
                      <button className="security-btn">Change Password</button>
                    </div>

                    <div className="security-item">
                      <div className="security-info">
                        <h3>Two-Factor Authentication</h3>
                        <p>{user?.twoFactorEnabled 
                          ? 'Currently enabled' 
                          : 'Add an extra layer of security'}</p>
                      </div>
                      <button className="security-btn">
                        {user?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                      </button>
                    </div>

                    <div className="security-item">
                      <div className="security-info">
                        <h3>Active Sessions</h3>
                        <p>{user?.activeSessions?.length || 0} active sessions</p>
                      </div>
                      <button className="security-btn">View Sessions</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="tab-content">
                  <div className="section-header">
                    <h2>Notification Preferences</h2>
                    {!isEditing ? (
                      <button 
                        className="edit-btn" 
                        onClick={handleEdit}
                      >
                        <Edit3 size={16} />
                        Edit Notifications
                      </button>
                    ) : (
                      <div className="edit-actions">
                        <button 
                          className="save-btn"
                          onClick={handleSave}
                        >
                          <Save size={16} />
                          Save Changes
                        </button>
                        <button 
                          className="cancel-btn" 
                          onClick={handleCancel}
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="notification-options">
                    <div className="notification-group">
                      <h3>Order Updates</h3>
                      <div className="notification-item">
                        <label className="notification-label">
                          <input 
                            type="checkbox" 
                            checked={user?.notifications?.orderConfirmation || false}
                            onChange={(e) => handleInputChange('notifications.orderConfirmation', e.target.checked)}
                            disabled={!isEditing}
                          />
                          <span className="checkmark"></span>
                          Order confirmation
                        </label>
                      </div>
                      <div className="notification-item">
                        <label className="notification-label">
                          <input 
                            type="checkbox" 
                            checked={user?.notifications?.deliveryUpdates || false}
                            onChange={(e) => handleInputChange('notifications.deliveryUpdates', e.target.checked)}
                            disabled={!isEditing}
                          />
                          <span className="checkmark"></span>
                          Delivery updates
                        </label>
                      </div>
                    </div>

                    <div className="notification-group">
                      <h3>Promotions</h3>
                      <div className="notification-item">
                        <label className="notification-label">
                          <input 
                            type="checkbox" 
                            checked={user?.notifications?.specialOffers || false}
                            onChange={(e) => handleInputChange('notifications.specialOffers', e.target.checked)}
                            disabled={!isEditing}
                          />
                          <span className="checkmark"></span>
                          Special offers
                        </label>
                      </div>
                      <div className="notification-item">
                        <label className="notification-label">
                          <input 
                            type="checkbox" 
                            checked={user?.notifications?.newMenuItems || false}
                            onChange={(e) => handleInputChange('notifications.newMenuItems', e.target.checked)}
                            disabled={!isEditing}
                          />
                          <span className="checkmark"></span>
                          New menu items
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;