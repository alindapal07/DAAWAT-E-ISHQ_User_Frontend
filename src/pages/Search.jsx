import {
  ChevronDown,
  Clock,
  Search as SearchIcon,
  SlidersHorizontal,
  Star,
  Users,
  X,
  TrendingUp,
  Flame,
  Sparkles,
  History,
  ArrowUpRight,
} from "lucide-react";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { MenuContext } from "../context/MenuContext";
import "./Search.css";

/* -----------------------------------------------------------------------
   SORT OPTIONS
----------------------------------------------------------------------- */
const SORT_OPTIONS = [
  { value: "relevance", label: "Sort by: Relevance" },
  { value: "rating", label: "Sort by: Rating" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "popularity", label: "Sort by: Popularity" },
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop";

const normalizeSearchWord = (word) => {
  const map = {
    soups: "soup",
    soup: "soup",
    noodles: "noodle",
    noodle: "noodle",
    kebab: "kebab",
    kabab: "kebab",
    paneer: "paneer",
    panner: "paneer",
  };

  return map[word] || word;
};

/* -----------------------------------------------------------------------
   NLP PARSER — understands phrases like "paneer under 200", "spicy chicken"
----------------------------------------------------------------------- */
const parseNaturalQuery = (query) => {
  const q = query.toLowerCase().trim();
  const hints = {
    maxPrice: null,
    minRating: null,
    dietary: null,
    isSpicy: null,
    keywords: [],
  };
  const priceMatch =
    q.match(/under\s*(?:rs\.?|₹)?\s*(\d+)/i) ||
    q.match(/(?:below|less than)\s*(?:rs\.?|₹)?\s*(\d+)/i);
  if (priceMatch) hints.maxPrice = parseFloat(priceMatch[1]);

  if (/\b(veg|vegetarian)\b/.test(q)) hints.dietary = "veg";
  if (/\b(non.?veg|chicken|mutton|fish|prawn|egg)\b/.test(q))
    hints.dietary = "non-veg";
  if (/\b(spicy|hot|fiery)\b/.test(q)) hints.isSpicy = true;
  if (/\b(healthy|light|salad|soup)\b/.test(q)) hints.minRating = 4.0;

  const stopWords = new Set([
    "under",
    "below",
    "less",
    "than",
    "rs",
    "for",
    "me",
    "some",
    "the",
    "a",
    "an",
    "with",
    "and",
    "or",
    "in",
    "near",
    "good",
    "best",
    "find",
    "show",
    "get",
  ]);
  hints.keywords = q
    .split(/\s+/)
    .filter((w) => !stopWords.has(w) && !/^\d+$/.test(w) && w.length > 1);
  return hints;
};

/* -----------------------------------------------------------------------
   RENDER STARS
----------------------------------------------------------------------- */
const renderStars = (rating) =>
  Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      size={13}
      fill={i < Math.round(rating) ? "#f59e0b" : "#d1d5db"}
      color={i < Math.round(rating) ? "#f59e0b" : "#d1d5db"}
    />
  ));

/* -----------------------------------------------------------------------
   CUSTOM SORT DROPDOWN
----------------------------------------------------------------------- */
const SortDropdown = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || options[0].label;

  return (
    <div className="custom-sort-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className={`sort-trigger${open ? " sort-trigger--open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="sort-trigger-label">{selectedLabel}</span>
        <ChevronDown size={16} className="sort-chevron" />
      </button>
      <ul
        className={`sort-options-list${open ? " sort-options-list--open" : ""}`}
        role="listbox"
      >
        {options.map((option) => (
          <li
            key={option.value}
            role="option"
            aria-selected={option.value === value}
            className={`sort-option-item${option.value === value ? " sort-option-item--active" : ""}`}
            onMouseDown={() => {
              onChange(option.value);
              setOpen(false);
            }}
          >
            <span className="sort-option-dot" />
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

/* -----------------------------------------------------------------------
   SEARCH DROPDOWN (history + suggestions)
----------------------------------------------------------------------- */
const MAX_HISTORY = 8;
const HISTORY_KEY = "search_history_v1";

const getHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
};
const saveHistory = (query) => {
  if (!query.trim()) return;
  const hist = getHistory().filter((h) => h !== query.trim());
  hist.unshift(query.trim());
  localStorage.setItem(HISTORY_KEY, JSON.stringify(hist.slice(0, MAX_HISTORY)));
};
const deleteHistoryItem = (item) => {
  const hist = getHistory().filter((h) => h !== item);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
};

/* -----------------------------------------------------------------------
   RESULT CARD
----------------------------------------------------------------------- */
const ResultCard = ({ item, onAddToCart }) => (
  <div className="result-card">
    <div className="result-image">
      <img
        src={item.image || FALLBACK_IMAGE}
        alt={item.name}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
      />
      {item.tags && item.tags.length > 0 && (
        <div className="card-badge">{item.tags[0]}</div>
      )}
      <div className={`veg-indicator ${item.isVeg ? "veg" : "nonveg"}`}>
        <span className="veg-dot" />
      </div>
    </div>
    <div className="result-content">
      <div className="result-header">
        <h3>{item.name}</h3>
        <div className="result-rating">
          {renderStars(item.rating)}
          <span className="rating-number">
            {item.rating > 0 ? item.rating.toFixed(1) : ""}
          </span>
        </div>
      </div>
      <p className="result-description">{item.description}</p>
      <div className="result-meta">
        <div className="meta-item">
          <Clock size={13} />
          <span>{item.cookTime}</span>
        </div>
        <div className="meta-item">
          <Users size={13} />
          <span>{item.type || item.category}</span>
        </div>
      </div>
      <div className="result-tags">
        <span className={`tag ${item.isVeg ? "vegetarian" : "nonveg"}`}>
          {item.isVeg ? "Veg" : "Non-Veg"}
        </span>
        {item.isSpicy && <span className="tag spice-hot">Spicy</span>}
      </div>
      <div className="result-footer">
        <div className="price">Rs.{item.price}</div>
        <button onClick={() => onAddToCart(item)} className="add-to-cart-btn">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
);

/* -----------------------------------------------------------------------
   RECOMMENDED SECTION
----------------------------------------------------------------------- */
const RecommendedSection = ({ items, onAddToCart }) => {
  const popular = useMemo(
    () =>
      [...items]
        .filter((i) => i.rating >= 4.5)
        .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
        .slice(0, 6),
    [items],
  );

  const trending = useMemo(
    () =>
      [...items]
        .filter(
          (i) =>
            i.tags &&
            i.tags.some((t) =>
              [
                "Bestseller",
                "Popular",
                "Trending",
                "Chef Special",
                "Signature Dish",
              ].includes(t),
            ),
        )
        .slice(0, 4),
    [items],
  );

  if (popular.length === 0) return null;

  return (
    <div className="recommended-section">
      {trending.length > 0 && (
        <div className="rec-block">
          <div className="rec-block-header">
            <Flame size={18} className="rec-icon trending" />
            <h3>Trending Right Now</h3>
          </div>
          <div className="trending-chips">
            {trending.map((item) => (
              <button
                key={item.id}
                className="trending-chip"
                onClick={() => onAddToCart(item)}
                title={`Rs.${item.price}`}
              >
                <img
                  src={item.image || FALLBACK_IMAGE}
                  alt={item.name}
                  className="chip-img"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                <span className="chip-name">{item.name}</span>
                <span className="chip-price">Rs.{item.price}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="rec-block">
        <div className="rec-block-header">
          <Sparkles size={18} className="rec-icon popular" />
          <h3>Recommended For You</h3>
          <span className="rec-subtitle">Based on popularity</span>
        </div>
        <div className="rec-grid">
          {popular.map((item) => (
            <ResultCard key={item.id} item={item} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </div>
  );
};

/* -----------------------------------------------------------------------
   EMPTY STATE
----------------------------------------------------------------------- */
const EmptyState = ({ query, allItems, onSuggestionClick }) => {
  const suggestions = useMemo(
    () =>
      [...allItems]
        .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
        .slice(0, 4),
    [allItems],
  );

  const tips = ["biryani", "chicken", "paneer", "soup", "noodles"];

  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <SearchIcon size={40} strokeWidth={1.2} />
      </div>
      <h3>No results for &ldquo;{query}&rdquo;</h3>
      <p>Try different keywords or explore popular dishes below</p>

      <div className="empty-suggestions">
        <p className="empty-try-label">Try searching for:</p>
        <div className="empty-chips">
          {tips.map((tip) => (
            <button
              key={tip}
              className="empty-chip"
              onClick={() => onSuggestionClick(tip)}
            >
              {tip}
            </button>
          ))}
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="empty-popular">
          <p className="empty-try-label">Popular dishes you might like:</p>
          <div className="empty-popular-grid">
            {suggestions.map((item) => (
              <div key={item.id} className="empty-popular-item">
                <img
                  src={item.image || FALLBACK_IMAGE}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                <span>{item.name}</span>
                <span className="empty-item-price">Rs.{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* -----------------------------------------------------------------------
   MAIN SEARCH PAGE
----------------------------------------------------------------------- */
const SearchPage = () => {
  const { addToCart } = useContext(CartContext);
  const { menuItems, loading: menuLoading } = useContext(MenuContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    rating: "",
    dietary: "",
  });
  const [sortBy, setSortBy] = useState("relevance");

  /* ── Search overlay state ── */
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [history, setHistory] = useState(getHistory());
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  /* ── Auto suggestions while typing ── */
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return menuItems
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.category && item.category.toLowerCase().includes(q)) ||
          (item.type && item.type.toLowerCase().includes(q)) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(q))),
      )
      .slice(0, 6);
  }, [searchQuery, menuItems]);

  /* ── Sync URL param ── */
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchQuery(q);
  }, [searchParams]);

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const categories = useMemo(
    () => [...new Set(menuItems.map((item) => item.type).filter(Boolean))],
    [menuItems],
  );

  /* ── Perform search (instant, no Enter needed) ── */
  const performSearch = useCallback(() => {
    if (menuLoading) return;
    setIsLoading(true);

    const nlp = parseNaturalQuery(searchQuery);

    let filtered = menuItems.filter((item) => {
      const isAvailable = (item.status || "available") === "available";

      let matchesQuery = true;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const words = q.split(/\s+/).filter(Boolean);

        matchesQuery = words.some((word) => {
          const w = normalizeSearchWord(word);

          return (
            item.name.toLowerCase().includes(w) ||
            (item.description && item.description.toLowerCase().includes(w)) ||
            (item.tags && item.tags.some((t) => t.toLowerCase().includes(w))) ||
            (item.type && item.type.toLowerCase().includes(w)) ||
            (item.category && item.category.toLowerCase().includes(w))
          );
        });

        /* NLP: price hint */
        if (nlp.maxPrice && item.price > nlp.maxPrice) matchesQuery = false;
        if (nlp.isSpicy !== null && item.isSpicy !== nlp.isSpicy)
          matchesQuery = false;
        if (nlp.dietary === "veg" && !item.isVeg) matchesQuery = false;
        if (nlp.dietary === "non-veg" && item.isVeg) matchesQuery = false;
      }

      const matchesCategory =
        !filters.category ||
        item.type === filters.category ||
        item.category === filters.category;
      let matchesDietary = true;
      if (filters.dietary)
        matchesDietary = filters.dietary === "veg" ? item.isVeg : !item.isVeg;

      let matchesPrice = true;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split("-").map(Number);
        matchesPrice = max
          ? item.price >= min && item.price <= max
          : item.price >= min;
      }

      const matchesRating =
        !filters.rating || item.rating >= parseFloat(filters.rating);
      return (
        isAvailable &&
        matchesQuery &&
        matchesCategory &&
        matchesDietary &&
        matchesPrice &&
        matchesRating
      );
    });

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "popularity":
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      default:
        break;
    }

    setSearchResults(filtered);
    setTimeout(() => setIsLoading(false), 200);
  }, [searchQuery, filters, sortBy, menuItems, menuLoading]);

  /* Instant search — fire on every keystroke */
  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) saveHistory(q);
    setHistory(getHistory());
    setDropdownOpen(false);
    setSearchParams(q ? { q } : {});
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setDropdownOpen(true);
  };

  const handleSuggestionClick = (query) => {
    setSearchQuery(query);
    saveHistory(query);
    setHistory(getHistory());
    setDropdownOpen(false);
    setSearchParams(query ? { q: query } : {});
  };

  const handleDeleteHistory = (item, e) => {
    e.stopPropagation();
    deleteHistoryItem(item);
    setHistory(getHistory());
  };

  const clearFilters = () =>
    setFilters({ category: "", priceRange: "", rating: "", dietary: "" });

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const hasQuery = searchQuery.trim().length > 0;

  /* Quick search chips for when input is empty */
  const quickSearches = useMemo(
    () => ["Biryani", "Butter Chicken", "Paneer", "Soup", "Noodles", "Kebab"],
    [],
  );

  return (
    <div className="search-page">
      <div className="search-hero">
        <div className="search-hero-inner">
          <div className="search-hero-text">
            <h1>What are you craving?</h1>
            <p>
              Search across our entire menu — try "Spicy chicken" or "Paneer
              under 200"
            </p>
          </div>

          {/* ── MAIN SEARCH BAR ── */}
          <div className="search-bar-wrap" ref={dropdownRef}>
            <form
              onSubmit={handleSearchSubmit}
              className="search-form-hero"
              autoComplete="off"
            >
              <div
                className={`search-input-box${dropdownOpen ? " focused" : ""}`}
              >
                <SearchIcon size={20} className="search-icon-hero" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search dishes, e.g. 'Spicy chicken' or 'Paneer under 200'..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  onFocus={() => setDropdownOpen(true)}
                  className="search-input-hero"
                  spellCheck={false}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchParams({});
                      searchInputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
                <button type="submit" className="search-submit-btn">
                  Search
                </button>
              </div>
            </form>

            {/* ── DROPDOWN PANEL ── */}
            {dropdownOpen && (
              <div className="search-dropdown">
                {/* Auto-suggestions while typing */}
                {searchQuery.trim().length >= 2 && suggestions.length > 0 && (
                  <div className="dropdown-section">
                    <div className="dropdown-section-label">
                      <SearchIcon size={13} /> Suggestions
                    </div>
                    {suggestions.map((item) => (
                      <button
                        key={item.id}
                        className="dropdown-suggestion-item"
                        onMouseDown={() => handleSuggestionClick(item.name)}
                      >
                        <img
                          src={item.image || FALLBACK_IMAGE}
                          alt={item.name}
                          className="suggestion-thumb"
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_IMAGE;
                          }}
                        />
                        <div className="suggestion-info">
                          <span className="suggestion-name">{item.name}</span>
                          <span className="suggestion-meta">
                            {item.type || item.category} · Rs.{item.price}
                          </span>
                        </div>
                        <ArrowUpRight size={14} className="suggestion-arrow" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Recent searches */}
                {!searchQuery.trim() && history.length > 0 && (
                  <div className="dropdown-section">
                    <div className="dropdown-section-label">
                      <History size={13} /> Recent searches
                    </div>
                    {history.slice(0, 5).map((h) => (
                      <button
                        key={h}
                        className="dropdown-history-item"
                        onMouseDown={() => handleSuggestionClick(h)}
                      >
                        <History size={14} className="history-icon" />
                        <span>{h}</span>
                        <div
                          className="history-delete"
                          onMouseDown={(e) => handleDeleteHistory(h, e)}
                          role="button"
                          tabIndex="0"
                          aria-label={`Remove ${h}`}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleDeleteHistory(h, e)
                          }
                        >
                          <X size={12} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick search when input is empty */}
                {!searchQuery.trim() && (
                  <div className="dropdown-section">
                    <div className="dropdown-section-label">
                      <TrendingUp size={13} /> Popular searches
                    </div>
                    <div className="dropdown-quick-chips">
                      {quickSearches.map((q) => (
                        <button
                          key={q}
                          className="dropdown-quick-chip"
                          onMouseDown={() => handleSuggestionClick(q)}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick search chips */}
          <div className="hero-quick-chips">
            {quickSearches.map((q) => (
              <button
                key={q}
                className="hero-chip"
                onClick={() => handleSuggestionClick(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container search-container">
        {/* Controls bar */}
        <div className="search-controls-bar">
          <div className="controls-left">
            {hasQuery && !isLoading && !menuLoading && (
              <span className="results-count-chip">
                {searchResults.length} result
                {searchResults.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}
                &rdquo;
              </span>
            )}
          </div>
          <div className="controls-right">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`filter-toggle${showFilters ? " active" : ""}${activeFilterCount > 0 ? " has-filters" : ""}`}
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="filter-badge">{activeFilterCount}</span>
              )}
            </button>
            <SortDropdown
              value={sortBy}
              onChange={setSortBy}
              options={SORT_OPTIONS}
            />
          </div>
        </div>

        <div className="search-content">
          <div
            className={`filters-overlay${showFilters ? " show" : ""}`}
            onClick={() => setShowFilters(false)}
            aria-hidden="true"
          />

          <aside className={`filters-sidebar${showFilters ? " show" : ""}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <button onClick={clearFilters} className="clear-filters">
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.3rem",
                    color: "#64748b",
                    lineHeight: 1,
                  }}
                  aria-label="Close filters"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="filter-group">
              <h4>Category</h4>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, category: e.target.value }))
                }
                className="filter-select"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <h4>Dietary</h4>
              <select
                value={filters.dietary}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, dietary: e.target.value }))
                }
                className="filter-select"
              >
                <option value="">All</option>
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
              </select>
            </div>
            <div className="filter-group">
              <h4>Price Range (Rs.)</h4>
              <select
                value={filters.priceRange}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, priceRange: e.target.value }))
                }
                className="filter-select"
              >
                <option value="">Any Price</option>
                <option value="0-150">Under Rs.150</option>
                <option value="150-300">Rs.150 – Rs.300</option>
                <option value="300-">Above Rs.300</option>
              </select>
            </div>
            <div className="filter-group">
              <h4>Minimum Rating</h4>
              <select
                value={filters.rating}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, rating: e.target.value }))
                }
                className="filter-select"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>
          </aside>

          <main className="search-results">
            {menuLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading menu data...</p>
              </div>
            ) : isLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Finding delicious dishes...</p>
              </div>
            ) : !hasQuery ? (
              /* ── NO QUERY: show recommended section ── */
              <RecommendedSection items={menuItems} onAddToCart={addToCart} />
            ) : searchResults.length > 0 ? (
              <>
                <div className="results-header-bar">
                  <h2>
                    {searchResults.length} result
                    {searchResults.length !== 1 ? "s" : ""} for &ldquo;
                    {searchQuery}&rdquo;
                  </h2>
                </div>
                <div className="results-grid">
                  {searchResults.map((item) => (
                    <ResultCard
                      key={item.id}
                      item={item}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState
                query={searchQuery}
                allItems={menuItems}
                onSuggestionClick={handleSuggestionClick}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
