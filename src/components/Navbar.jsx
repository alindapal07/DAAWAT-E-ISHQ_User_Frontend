import { Menu, Search, User, X } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AdminAuthContext } from "../admin/AdminAuthContext";
import logo from "../Assets/logo.PNG";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { MenuContext } from "../context/MenuContext";
import "./Navbar.css";
import CartButton from "./CartButton";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const suggestionsRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);
  const { admin, logout: adminLogout } = useContext(AdminAuthContext);

  const { cartItems, cartRef } = useContext(CartContext);
  const { menuItems } = useContext(MenuContext);

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  /* ===============================
     LIVE SEARCH SUGGESTIONS
  =============================== */
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      return;
    }
    const q = searchQuery.trim().toLowerCase();
    const matched = [];
    const seen = new Set();

    menuItems.forEach(item => {
      // Match by name
      if (item.name && item.name.toLowerCase().includes(q)) {
        const key = item.name.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          matched.push({ label: item.name, type: 'dish', image: item.image });
        }
      }
      // Match by category
      const cat = item.category || item.type;
      if (cat && cat.toLowerCase().includes(q)) {
        const key = cat.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          matched.push({ label: cat, type: 'category' });
        }
      }
      // Match by tags
      if (Array.isArray(item.tags)) {
        item.tags.forEach(tag => {
          if (tag && tag.toLowerCase().includes(q)) {
            const key = `tag:${tag.toLowerCase()}`;
            if (!seen.has(key)) {
              seen.add(key);
              matched.push({ label: tag, type: 'tag' });
            }
          }
        });
      }
    });

    setSuggestions(matched.slice(0, 7));
    setShowSuggestions(matched.length > 0);
    setHighlightedIndex(-1);
  }, [searchQuery, menuItems]);

  /* ===============================
     MOBILE DETECTION
  =============================== */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ===============================
     SCROLL EFFECT
  =============================== */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ===============================
     ROUTE CHANGE CLEANUP
  =============================== */
  useEffect(() => {
    setIsOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  /* ===============================
     BODY OVERFLOW FOR MOBILE NAV
  =============================== */
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile]);

  /* ===============================
     CLICK OUTSIDE HANDLER
  =============================== */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest(".user-menu")) {
        setUserMenuOpen(false);
      }
      if (
        searchOpen &&
        !event.target.closest(".search-container") &&
        !event.target.closest(".mobile-search-bar")
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [userMenuOpen, searchOpen]);

  /* ===============================
     NAV LINKS
  =============================== */
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Reservations", path: "/reservations" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Blog", path: "/blog" },
  ];

  /* ===============================
     SEARCH HANDLER
  =============================== */
  const closeSuggestions = () => {
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handleSuggestionClick = (label) => {
    navigate(`/search?q=${encodeURIComponent(label)}`);
    setSearchQuery("");
    setSearchOpen(false);
    closeSuggestions();
  };

  const handleSearchKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      closeSuggestions();
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[highlightedIndex].label);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    setSearchOpen(false);
    closeSuggestions();
  };

  /* ===============================
     LOGOUT
  =============================== */
  const handleLogout = () => {
    admin ? adminLogout() : logout();
    setUserMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="container">
          <div className="nav-content">

            {/* ── LOGO ── */}
            <div className="nav-left">
              <Link to="/" className="nav-logo">
                <img src={logo} alt="Daawat-E-Ishq" />
                <span className="script-font">Daawat-E-Ishq</span>
              </Link>
            </div>

            {/* ── CENTER NAV (DESKTOP) ── */}
            {!isMobile && (
              <div className="nav-center">
                <div className="nav-menu">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ── RIGHT ACTIONS ── */}
            <div className="nav-right">
              <div className="nav-actions">

                {/* SEARCH */}
                <div className=" nav-menu ">
                  <button
                    className="nav-action-btn "
                    // data-tooltip="Search"
                    aria-label="Search"
                    onClick={() => navigate("/search")}
                  >
                    <Search size={19} />
                  </button>

                  {/* Desktop search dropdown */}
                  {!isMobile && searchOpen && (
                    <div className="search-dropdown">
                      <form onSubmit={handleSearch} className="search-form">
                        <input
                          type="text"
                          className="search-input"
                          placeholder="Search dishes..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={handleSearchKeyDown}
                          autoFocus
                          autoComplete="off"
                        />
                        <button type="submit" className="search-submit-btn" aria-label="Submit search">
                          <Search size={16} />
                        </button>
                      </form>
                      {/* Autocomplete Suggestions */}
                      {showSuggestions && suggestions.length > 0 && (
                        <ul className="search-suggestions" ref={suggestionsRef}>
                          {suggestions.map((s, idx) => (
                            <li
                              key={idx}
                              className={`search-suggestion-item${highlightedIndex === idx ? ' highlighted' : ''}`}
                              onMouseDown={() => handleSuggestionClick(s.label)}
                              onMouseEnter={() => setHighlightedIndex(idx)}
                            >
                              <span className={`suggestion-type-icon suggestion-type-${s.type}`}>
                                {s.type === 'dish' ? '🍽️' : s.type === 'category' ? '📂' : '🏷️'}
                              </span>
                              <span className="suggestion-label">{s.label}</span>
                              <span className="suggestion-type-badge">{s.type}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                {/* WISHLIST */}
                {/* <Link
                  to="/wishlist"
                  className="nav-action-btn"
                  data-tooltip="Wishlist"
                  aria-label="Wishlist"
                >
                  <Heart size={19} />
                </Link> */}

                {/* CART */}
                <CartButton ref={cartRef} itemCount={itemCount} />

                {/* Thin divider between cart and user/login */}
                <span className="nav-pill-divider" aria-hidden="true" />

                {/* USER / LOGIN */}
                {user || admin ? (
                  <div className="user-menu">
                    <button
                      className="nav-action-btn user-btn"
                      data-tooltip="Account"
                      aria-label="User menu"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserMenuOpen((prev) => !prev);
                      }}
                    >
                      <User size={19} />
                    </button>

                    <div className={`user-dropdown ${userMenuOpen ? "active" : ""}`}>
                      <div className="user-info">
                        <div className="user-avatar">
                          <User size={22} />
                        </div>
                        <div className="user-details">
                          <span className="user-name">
                            {user?.name || admin?.name}
                          </span>
                          <span className="user-email">
                            {user?.email || admin?.email}
                          </span>
                        </div>
                      </div>

                      <div className="dropdown-divider" />

                      {admin ? (
                        <>
                          <Link to="/admin">Admin Dashboard</Link>
                          <Link to="/admin/menu">Menu Management</Link>
                          <Link to="/admin/orders">Orders</Link>
                          <div className="dropdown-divider" />
                        </>
                      ) : (
                        <>
                          <Link to="/profile">My Profile</Link>
                          <Link to="/orders">My Orders</Link>
                          <div className="dropdown-divider" />
                        </>
                      )}

                      <button className="logout-btn" onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="btn btn-primary nav-login"
                    data-tooltip="Login"
                    aria-label="Login"
                  >
                    <span className="nav-login-text">Login</span>
                    <span className="nav-login-icon">
                      <User size={18} />
                    </span>
                  </Link>
                )}
              </div>

              {/* ── HAMBURGER — always after the pill ── */}
              {isMobile && (
                <button
                  className={`mobile-menu-btn${isOpen ? " open" : ""}`}
                  onClick={() => {
                    setIsOpen((prev) => !prev);
                    setSearchOpen(false);
                    setUserMenuOpen(false);
                  }}
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isOpen}
                >
                  {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              )}
            </div>
          </div>

          {/* ── MOBILE SEARCH BAR ── */}
          {isMobile && searchOpen && (
            <div className="mobile-search-bar">
              <form onSubmit={handleSearch} className="mobile-search-form">
                <input
                  className="mobile-search-input"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  autoFocus
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="mobile-search-submit"
                  aria-label="Submit search"
                >
                  <Search size={18} />
                </button>
              </form>
              {/* Mobile Autocomplete Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <ul className="search-suggestions mobile-search-suggestions">
                  {suggestions.map((s, idx) => (
                    <li
                      key={idx}
                      className={`search-suggestion-item${highlightedIndex === idx ? ' highlighted' : ''}`}
                      onMouseDown={() => handleSuggestionClick(s.label)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                    >
                      <span className="suggestion-type-icon">
                        {s.type === 'dish' ? '🍽️' : s.type === 'category' ? '📂' : '🏷️'}
                      </span>
                      <span className="suggestion-label">{s.label}</span>
                      <span className="suggestion-type-badge">{s.type}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ── MOBILE OVERLAY + MENU ── */}
      {isMobile && isOpen && (
        <>
          <div
            className="mobile-menu-overlay"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="mobile-menu" role="navigation" aria-label="Mobile navigation">
            <div className="mobile-menu-content">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`mobile-menu-link ${location.pathname === link.path ? "active" : ""}`}
                  onClick={() => setIsOpen(false)}
                  style={{ animationDelay: `${index * 0.055}s` }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;