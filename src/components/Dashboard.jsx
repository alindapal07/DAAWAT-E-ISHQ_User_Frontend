import {
  AlertCircle,
  Award,
  Bell,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  Heart,
  Package,
  ShoppingBag,
  Star,
  TrendingUp,
  User,
  Utensils,
  XCircle
} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeFilter, setActiveFilter] = useState('all');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  
  // Fetch user's orders
  useEffect(() => {
    setOrdersLoading(true);
    api.get('/orders/my')
      .then(res => {
        setOrders(res.data);
        setOrdersLoading(false);
      })
      .catch(err => {
        setOrdersError('Failed to fetch orders');
        setOrdersLoading(false);
      });
  }, []);

  // Fetch user's reservations
  useEffect(() => {
    setLoading(true);
    api.get('/reservations/my')
      .then(res => {
        setReservations(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch reservations');
        setLoading(false);
      });
  }, []);

  // Fetch user's favorites/wishlist
  useEffect(() => {
    setFavoritesLoading(true);
    api.get('/menu/favorites')
      .then(res => {
        setFavorites(res.data);
        setFavoritesLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch favorites:', err);
        setFavoritesLoading(false);
      });
  }, []);

  useEffect(() => {
    if (user && user.role === 'admin') {
      setLoading(true);
      api.get('/reservations')
        .then(res => {
          setReservations(res.data);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to fetch reservations');
          setLoading(false);
        });
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      setOrdersLoading(true);
      api.get('/orders')
        .then(res => {
          setOrders(res.data);
          setOrdersLoading(false);
        })
        .catch(err => {
          setOrdersError('Failed to fetch orders');
          setOrdersLoading(false);
        });
    }
  }, [user]);

  // State for real data
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalOrders: orders.length,
      activeReservations: reservations.filter(r => new Date(r.date) > new Date()).length,
      wishlistItems: user?.wishlist?.length || 0,
      loyaltyPoints: user?.loyaltyPoints || 0,
      totalSpent: orders.reduce((total, order) => total + order.total, 0),
      reviewsGiven: user?.reviews?.length || 0
    },
    recentOrders: orders.slice(0, 4).map(order => ({
      id: order._id,
      date: order.createdAt,
      items: order.items.map(item => item.name),
      total: order.total,
      status: order.status,
      rating: order.rating,
      deliveryTime: order.deliveryTime
    })),
    upcomingReservations: reservations
      .filter(r => new Date(r.date) > new Date())
      .slice(0, 3)
      .map(res => ({
        id: res._id,
        date: res.date,
        time: res.time,
        guests: res.guests,
        table: res.table || `Table ${res.tableNumber || 'TBD'}`,
        status: res.status
      })),
    favoriteItems: (user?.favorites || []).slice(0, 3).map(fav => ({
      id: fav._id,
      name: fav.name,
      image: fav.image,
      price: fav.price,
      orderCount: orders.filter(order => 
        order.items.some(item => item.name === fav.name)
      ).length
    }))
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={16} className="status-icon delivered" />;
      case 'preparing':
        return <Clock size={16} className="status-icon preparing" />;
      case 'cancelled':
        return <XCircle size={16} className="status-icon cancelled" />;
      default:
        return <AlertCircle size={16} className="status-icon pending" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'preparing':
        return 'Preparing';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };


  const quickActions = [
    { icon: Utensils, label: 'Browse Menu', link: '/menu', color: 'orange' },
    { icon: Calendar, label: 'Make Reservation', link: '/reservations', color: 'blue' },
    { icon: Heart, label: 'My Wishlist', link: '/wishlist', color: 'red' },
    { icon: User, label: 'Edit Profile', link: '/profile', color: 'green' }
  ];

  return (
    <div className="dashboard-page">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="welcome-section">
              <h1>Welcome back, {user?.name || 'Food Lover'}!</h1>
              <p>Here's what's happening with your account</p>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <div className="stat-icon">
                  <Award size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-number">
                    {ordersLoading ? '...' : user?.loyaltyPoints || 0}
                  </div>
                  <div className="stat-label">Loyalty Points</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-info">
                  <div className="stat-number">
                    ₹{ordersLoading ? '...' : orders.reduce((total, order) => total + order.total, 0).toLocaleString()}
                  </div>
                  <div className="stat-label">Total Spent</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <div className="container">
          <div className="dashboard-grid">
            {/* Quick Actions */}
            <div className="dashboard-card quick-actions-card">
              <h2>Quick Actions</h2>
              <div className="quick-actions">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link 
                      key={index} 
                      to={action.link} 
                      className={`quick-action ${action.color}`}
                    >
                      <div className="action-icon">
                        <Icon size={24} />
                      </div>
                      <span>{action.label}</span>
                      <ChevronRight size={16} />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Stats Overview */}
            <div className="dashboard-card stats-card">
              <h2>Your Stats</h2>
              <div className="stats-grid">
                <div className="stat-box">
                  <div className="stat-icon orders">
                    <ShoppingBag size={20} />
                  </div>
                  <div className="stat-details">
                    <div className="stat-number">
                      {ordersLoading ? '...' : orders.length}
                    </div>
                    <div className="stat-label">Total Orders</div>
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon reservations">
                    <Calendar size={20} />
                  </div>
                  <div className="stat-details">
                    <div className="stat-number">
                      {loading ? '...' : reservations.filter(r => new Date(r.date) > new Date()).length}
                    </div>
                    <div className="stat-label">Active Reservations</div>
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon wishlist">
                    <Heart size={20} />
                  </div>
                  <div className="stat-details">
                    <div className="stat-number">
                      {favoritesLoading ? '...' : favorites.length}
                    </div>
                    <div className="stat-label">Wishlist Items</div>
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon reviews">
                    <Star size={20} />
                  </div>
                  <div className="stat-details">
                    <div className="stat-number">
                      {user?.reviews?.length || 0}
                    </div>
                    <div className="stat-label">Reviews Given</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="dashboard-card orders-card">
              <div className="card-header">
                <h2>Recent Orders</h2>
                <div className="order-filters">
                  <button 
                    className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('all')}
                  >
                    All
                  </button>
                  <button 
                    className={`filter-btn ${activeFilter === 'delivered' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('delivered')}
                  >
                    Delivered
                  </button>
                  <button 
                    className={`filter-btn ${activeFilter === 'preparing' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('preparing')}
                  >
                    Active
                  </button>
                </div>
              </div>
              <div className="orders-list">
                {ordersLoading ? (
                  <div className="loading-state">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="empty-state">
                    <ShoppingBag size={48} />
                    <p>No orders yet</p>
                    <Link to="/menu" className="cta-btn">Browse Menu</Link>
                  </div>
                ) : (
                  orders
                    .filter(order => activeFilter === 'all' || order.status === activeFilter)
                    .slice(0, 4)
                    .map(order => (
                      <div key={order._id} className="order-item">
                        <div className="order-header">
                          <div className="order-id">#{order._id.slice(-6).toUpperCase()}</div>
                          <div className="order-status">
                            {getStatusIcon(order.status)}
                            <span>{getStatusText(order.status)}</span>
                          </div>
                        </div>
                        <div className="order-details">
                          <div className="order-items">
                            {order.items.slice(0, 2).map(item => item.name).join(', ')}
                            {order.items.length > 2 && ` +${order.items.length - 2} more`}
                          </div>
                          <div className="order-meta">
                            <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                            <span className="order-total">₹{order.total}</span>
                          </div>
                        </div>
                        {order.deliveryTime && (
                          <div className="order-delivery">
                            <Clock size={14} />
                            {order.deliveryTime}
                          </div>
                        )}
                        {order.rating && (
                          <div className="order-rating">
                            <Star size={14} fill="currentColor" />
                            {order.rating}/5
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
              <Link to="/orders" className="view-all-btn">
                View All Orders
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Upcoming Reservations */}
            <div className="dashboard-card reservations-card">
              <div className="card-header">
                <h2>Upcoming Reservations</h2>
                <Link to="/reservations" className="header-link">
                  <Calendar size={16} />
                  Book New
                </Link>
              </div>
              {loading ? (
                <div className="loading-state">Loading reservations...</div>
              ) : reservations.length === 0 ? (
                <div className="empty-state">
                  <Calendar size={48} />
                  <p>No upcoming reservations</p>
                  <Link to="/reservations" className="cta-btn">Make a Reservation</Link>
                </div>
              ) : (
                <div className="reservations-list">
                  {reservations
                    .filter(r => new Date(r.date) > new Date())
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 3)
                    .map(reservation => (
                      <div key={reservation._id} className="reservation-item">
                        <div className="reservation-date">
                          <div className="date-day">
                            {new Date(reservation.date).getDate()}
                          </div>
                          <div className="date-month">
                            {new Date(reservation.date).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                        </div>
                        <div className="reservation-details">
                          <div className="reservation-time">{reservation.time}</div>
                          <div className="reservation-info">
                            {reservation.guests} guests • {reservation.table || `Table ${reservation.tableNumber || 'TBD'}`}
                          </div>
                          <div className={`reservation-status ${reservation.status}`}>
                            {reservation.status}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Favorite Items */}
            <div className="dashboard-card favorites-card">
              <div className="card-header">
                <h2>Your Favorites</h2>
                <Link to="/wishlist" className="header-link">
                  <Heart size={16} />
                  View All
                </Link>
              </div>
              <div className="favorites-list">
                {favoritesLoading ? (
                  <div className="loading-state">Loading favorites...</div>
                ) : favorites.length === 0 ? (
                  <div className="empty-state">
                    <Heart size={48} />
                    <p>No favorite items yet</p>
                    <Link to="/menu" className="cta-btn">Browse Menu</Link>
                  </div>
                ) : (
                  favorites.slice(0, 3).map(item => (
                    <div key={item._id} className="favorite-item">
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <div className="item-name">{item.name}</div>
                        <div className="item-price">₹{item.price}</div>
                        <div className="item-orders">
                          Ordered {orders.filter(order => 
                            order.items.some(orderItem => orderItem.name === item.name)
                          ).length} times
                        </div>
                      </div>
                      <button className="reorder-btn">
                        <Package size={16} />
                        Reorder
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Account Settings */}
            <div className="dashboard-card settings-card">
              <h2>Account Settings</h2>
              <div className="settings-list">
                <Link to="/profile" className="setting-item">
                  <div className="setting-icon">
                    <User size={20} />
                  </div>
                  <div className="setting-details">
                    <div className="setting-name">Profile Settings</div>
                    <div className="setting-desc">Update your personal information</div>
                  </div>
                  <ChevronRight size={16} />
                </Link>
                <Link to="/notifications" className="setting-item">
                  <div className="setting-icon">
                    <Bell size={20} />
                  </div>
                  <div className="setting-details">
                    <div className="setting-name">Notifications</div>
                    <div className="setting-desc">Manage your notification preferences</div>
                  </div>
                  <ChevronRight size={16} />
                </Link>
                <Link to="/payment-methods" className="setting-item">
                  <div className="setting-icon">
                    <CreditCard size={20} />
                  </div>
                  <div className="setting-details">
                    <div className="setting-name">Payment Methods</div>
                    <div className="setting-desc">Manage your saved payment methods</div>
                  </div>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {user && user.role === 'admin' && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-orange-700">All Reservations</h2>
          {loading ? (
            <div>Loading reservations...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Guests</th>
                    <th className="py-2 px-4 border-b">Date</th>
                    <th className="py-2 px-4 border-b">Time</th>
                    <th className="py-2 px-4 border-b">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r, i) => (
                    <tr key={i} className="text-center">
                      <td className="py-2 px-4 border-b">{r.name}</td>
                      <td className="py-2 px-4 border-b">{r.email}</td>
                      <td className="py-2 px-4 border-b">{r.guests}</td>
                      <td className="py-2 px-4 border-b">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b">{r.time}</td>
                      <td className="py-2 px-4 border-b">{r.message || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {user && user.role === 'admin' && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-orange-700">All Orders</h2>
          {ordersLoading ? (
            <div>Loading orders...</div>
          ) : ordersError ? (
            <div className="text-red-600">{ordersError}</div>
          ) : (
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full bg-white border rounded">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">User</th>
                    <th className="py-2 px-4 border-b">Items</th>
                    <th className="py-2 px-4 border-b">Total</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => (
                    <tr key={order._id || i} className="text-center">
                      <td className="py-2 px-4 border-b">{order.user?.name || 'N/A'}<br/><span className="text-xs text-gray-500">{order.user?.email}</span></td>
                      <td className="py-2 px-4 border-b">{order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}</td>
                      <td className="py-2 px-4 border-b">₹{order.total}</td>
                      <td className="py-2 px-4 border-b">{order.status}</td>
                      <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
