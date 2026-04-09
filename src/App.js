// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

/* =====================
   CONTEXT PROVIDERS
===================== */
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { MenuProvider } from './context/MenuContext';
import { WishlistProvider } from './context/WishlistContext';
import { AdminAuthProvider } from './admin/AdminAuthContext';

/* =====================
   LAYOUT COMPONENTS
===================== */
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

/* =====================
   USER PAGES
===================== */
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Reservations from './pages/Reservations';
import Reviews from './pages/Reviews';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Search from './pages/Search';
import Dashboard from './components/Dashboard';
import About from './components/About';

/* =====================
   AUTH PAGES
===================== */
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

/* =====================
   ADMIN PAGES
===================== */
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import RestaurantDashboard from './admin/RestaurantDashboard';
import OrderManagement from './admin/OrderManagement';
import MenuManagement from './admin/MenuManagement';
import Analytics from './admin/Analytics';
import AdminPanel from './admin/AdminPanel';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <CartProvider>
            <MenuProvider>
              <WishlistProvider>

                <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <ScrollToTop />

                  {/* Top navigation */}
                  <Navbar />

                  {/*
                    IMPORTANT:
                    Padding-top prevents content from hiding under fixed navbar.
                    DO NOT remove this.
                  */}
                  <main className="main-content">
                    <Routes>

                      {/* ========= PUBLIC ROUTES ========= */}
                      <Route path="/" element={<Home />} />
                      <Route path="/menu" element={<Menu />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/search" element={<Search />} />

                      {/* ========= AUTH ROUTES ========= */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />

                      {/* ========= USER PROTECTED ROUTES ========= */}
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/wishlist"
                        element={
                          <ProtectedRoute>
                            <Wishlist />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />

                      {/* ========= CART / RESERVATIONS ========= */}
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/reservations" element={<Reservations />} />
                      <Route path="/reviews" element={<Reviews />} />

                      {/* ========= ADMIN ROUTES ========= */}
                      <Route path="/admin/login" element={<AdminLogin />} />

                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute adminOnly>
                            <AdminLayout />
                          </ProtectedRoute>
                        }
                      >
                        <Route index element={<RestaurantDashboard />} />
                        <Route path="dashboard" element={<RestaurantDashboard />} />
                        <Route path="orders" element={<OrderManagement />} />
                        <Route path="menu" element={<MenuManagement />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="reservations" element={<AdminPanel />} />
                      </Route>

                      {/* ========= FALLBACK ========= */}
                      <Route path="*" element={<Home />} />

                    </Routes>
                  </main>

                  <Footer />
                </Router>

              </WishlistProvider>
            </MenuProvider>
          </CartProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
