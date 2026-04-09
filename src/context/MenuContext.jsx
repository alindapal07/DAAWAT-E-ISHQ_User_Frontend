import { createContext, useEffect, useState } from "react";
import api from "../utils/api";
import butterChickenImg from '../Assets/butterchicken.jpg';
import ElishImg from '../Assets/Elish.jpg';
import kachiiImg from '../Assets/kachii-biriyani.jpg';
import paneerImg from '../Assets/paneer-butter-masala.png'; 

export const MenuContext = createContext();
/* ─────────────────────────────────────────────
   FALLBACK DATA  (used when DB is empty OR offline)
   Keep this in sync with seedMenu.js
───────────────────────────────────────────── */
let id =1;
const getFallbackMenu = () => [
  /* ================= SALADS ================= */
  {
    id: id++,
    name: 'Green Salad',
    price: 60,
    description: 'Fresh green salad',
    image: 'https://cdn.prod.website-files.com/655daef7b0404cc1bd31be74/676aa83eee4001c8a7834a1c_03.-Fresh-Garden-Salad.jpg',
    rating: 4.2,
    reviewCount: 89,
    cookTime: '5 min',
    isVeg: true,
    isSpicy: false,
    tags: [],
    category: 'salads'
  },
  {
    id: id++,
    name: 'Chicken Salad',
    price: 200,
    description: 'Grilled chicken salad',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=400&fit=crop',
    rating: 4.4,
    reviewCount: 92,
    cookTime: '15 min',
    isVeg: false,
    isSpicy: false,
    tags: [],
    category: 'salads'
  },

   /* ================= Signature Dishes ================= */
    {
    id: id++,
    name: 'Kachii Biryani',
    price: 499,
    description: 'Aromatic basmati rice with tender mutton, cooked in traditional dum style',
    image: kachiiImg,
    rating: 4.9,
    reviewCount: 512,
    cookTime: '45 min',
    isVeg: false,
    isSpicy: true,
    tags: [ 'Signature Dish'],
    category: 'biriyani'
  },
  {
    id: id++,
    name: 'Ilish Pulao (Full)',
    price: 490,
    description: 'Fragrant Bengali pulao with hilsa fish, gobindobhog rice, and mild spices',
    image: ElishImg,
    rating: 4.9,
    reviewCount: 421,
    cookTime: '25 min',
    isVeg: false,
    isSpicy: false,
    tags: [ 'Signature Dish'],
    category: 'pulao'
  },
  {
    id: id++,
    name: 'Butter Chicken',
    price: 399,
    description: 'Creamy tomato-based curry with tender chicken pieces',
    image: butterChickenImg,
    rating: 4.8,
    reviewCount: 689,
    cookTime: '30 min',
    isVeg: false,
    isSpicy: true,
    tags: [ 'Signature Dish'],
    category: 'indian-chicken'
  },
  {
    id: id++,
    name: 'Paneer Butter Masala',
    price: 349,
    description: 'Rich creamy paneer curry cooked with butter and spices',
    image: paneerImg,
    rating: 4.7,
    reviewCount: 350,
    cookTime: '25 min',
    isVeg: true,
    isSpicy: false,
    tags: ['Veg Special'],
    category: 'curry'
  },
  /* ================= SOUPS ================= */
  {
    id: id++,
    name: 'Hot & Sour Soup',
    price: 160,
    description: 'Spicy hot and sour soup',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=400&fit=crop',
    rating: 4.5,
    reviewCount: 167,
    cookTime: '15 min',
    isVeg: true,
    isSpicy: true,
    tags: [],
    category: 'soups'
  },
  {
    id: id++,
    name: 'Chicken Manchow Soup',
    price: 170,
    description: 'Classic chicken manchow soup',
    image: 'https://thumbs.dreamstime.com/b/chicken-manchow-soup-black-bowl-dark-slate-background-indo-chinese-cuisine-dish-bell-peppers-cabbage-carrot-noodles-160366288.jpg',
    rating: 4.6,
    reviewCount: 198,
    cookTime: '18 min',
    isVeg: false,
    isSpicy: true,
    tags: ['Popular'],
    category: 'soups'
  },

  /* ================= CHINESE FRIED RICE ================= */
  {
    id: id++,
    name: 'Veg Fried Rice',
    price: 140,
    description: 'Vegetable fried rice',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop',
    rating: 4.1,
    reviewCount: 189,
    cookTime: '15 min',
    isVeg: true,
    isSpicy: false,
    tags: [],
    category: 'fried-rice'
  },
  {
    id: id++,
    name: 'Chicken Fried Rice',
    price: 190,
    description: 'Chicken fried rice',
    image: 'https://images.unsplash.com/photo-1581184953963-d15972933db1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fENoaWNrZW4lMjBmcmllZCUyMHJpY2V8ZW58MHx8MHx8fDA%3D?w=400&h=400&fit=crop',
    rating: 4.5,
    reviewCount: 298,
    cookTime: '18 min',
    isVeg: false,
    isSpicy: true,
    tags: ['Bestseller'],
    category: 'fried-rice'
  },

  /* ================= BIRIYANI ================= */
  {
    id: id++,
    name: 'Chicken Biriyani',
    price: 200,
    description: 'Traditional chicken biriyani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop',
    rating: 4.6,
    reviewCount: 789,
    cookTime: '35 min',
    isVeg: false,
    isSpicy: true,
    tags: ['Popular'],
    category: 'biriyani'
  },
  {
    id: id++,
    name: 'Mutton Biriyani',
    price: 300,
    description: 'Classic mutton biriyani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 534,
    cookTime: '45 min',
    isVeg: false,
    isSpicy: true,
    tags: [ 'Chef Special'],
    category: 'biriyani'
  },

  /* ================= INDIAN CHICKEN GRAVY ================= */
  {
    id: id++,
    name: 'Chicken Kosha',
    price: 220,
    description: 'Bengali chicken kosha',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 345,
    cookTime: '28 min',
    isVeg: false,
    isSpicy: true,
    tags: ['Popular'],
    category: 'indian-chicken'
  },
  {
    id: id++,
    name: 'Butter Chicken',
    price: 280,
    description: 'Creamy butter chicken',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 378,
    cookTime: '30 min',
    isVeg: false,
    isSpicy: false,
    tags: ['Bestseller'],
    category: 'indian-chicken'
  },

  /* ================= KEBABS ================= */
  {
    id: id++,
    name: 'Reshmi Kebab',
    price: 250,
    description: 'Soft creamy chicken kebab',
    image: 'https://plus.unsplash.com/premium_photo-1661310019346-4cb563a19aec?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8a2FiYWJ8ZW58MHx8MHx8fDA%3D?w=400&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 423,
    cookTime: '26 min',
    isVeg: false,
    isSpicy: false,
    tags: ['Chef Special'],
    category: 'kebab'
  },

  /* ================= NOODLES ================= */
  {
    id: id++,
    name: 'Chicken Hakka Noodles',
    price: 220,
    description: 'Indo-Chinese style stir fried chicken noodles',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop',
    rating: 4.6,
    reviewCount: 210,
    cookTime: '20 min',
    isVeg: false,
    isSpicy: true,
    tags: ['Popular'],
    category: 'noodles'
  },
  {
    id: id++,
    name: 'Veg Hakka Noodles',
    price: 160,
    description: 'Stir fried noodles with fresh vegetables',
    image: 'https://images.unsplash.com/photo-1617196038435-2b4b5b1d1c9d?w=400&h=400&fit=crop',
    rating: 4.3,
    reviewCount: 150,
    cookTime: '18 min',
    isVeg: true,
    isSpicy: false,
    tags: [],
    category: 'noodles'
  },

  /* ================= CHINESE FISH ================= */
  {
    id: id++,
    name: 'Chilli Fish',
    price: 290,
    description: 'Crispy fish tossed in spicy chilli sauce',
    image: 'https://images.unsplash.com/photo-1625944525903-c3b3d8d8f9f7?w=400&h=400&fit=crop',
    rating: 4.6,
    reviewCount: 240,
    cookTime: '25 min',
    isVeg: false,
    isSpicy: true,
    tags: ['Bestseller'],
    category: 'chinese-fish'
  },
  {
    id: id++,
    name: 'Garlic Fish',
    price: 290,
    description: 'Fish cooked in rich garlic sauce',
    image: 'https://images.unsplash.com/photo-1625944525931-4a8b2ddb3f7b?w=400&h=400&fit=crop',
    rating: 4.5,
    reviewCount: 180,
    cookTime: '25 min',
    isVeg: false,
    isSpicy: false,
    tags: [],
    category: 'chinese-fish'
  },

  /* ================= PRAWN ITEMS ================= */
  {
    id: id++,
    name: 'Chilli Prawn',
    price: 250,
    description: 'Spicy prawn tossed with capsicum and sauces',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=400&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 260,
    cookTime: '22 min',
    isVeg: false,
    isSpicy: true,
    tags: ['Chef Special'],
    category: 'prawns'
  },
  {
    id: id++,
    name: 'Garlic Prawn',
    price: 270,
    description: 'Juicy prawns cooked in garlic butter sauce',
    image: 'https://images.unsplash.com/photo-1604908176997-431d9c5f45d6?w=400&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 310,
    cookTime: '24 min',
    isVeg: false,
    isSpicy: false,
    tags: ['Premium'],
    category: 'prawns'
  },

  /* ================= TADKA SPECIAL ================= */
  {
    id: id++,
    name: 'Egg Tadka',
    price: 100,
    description: 'Egg curry cooked with spicy tadka gravy',
    image: 'https://images.unsplash.com/photo-1604908177225-d3e44c8e3a68?w=400&h=400&fit=crop',
    rating: 4.3,
    reviewCount: 140,
    cookTime: '20 min',
    isVeg: false,
    isSpicy: true,
    tags: [],
    category: 'tadka'
  },
  {
    id: id++,
    name: 'Mutton Tadka',
    price: 200,
    description: 'Rich mutton gravy with tadka spices',
    image: 'https://images.unsplash.com/photo-1617191519105-d07b98b7b4d6?w=400&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 220,
    cookTime: '35 min',
    isVeg: false,
    isSpicy: true,
    tags: ['Special'],
    category: 'tadka'
  },

  /* ================= RICE & PULAO ================= */
  {
    id: id++,
    name: 'Jeera Rice',
    price: 120,
    description: 'Basmati rice tempered with cumin seeds',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=400&fit=crop',
    rating: 4.2,
    reviewCount: 160,
    cookTime: '15 min',
    isVeg: true,
    isSpicy: false,
    tags: [],
    category: 'rice'
  },
  {
    id: id++,
    name: 'Kashmiri Pulao',
    price: 200,
    description: 'Sweet pulao with dry fruits and saffron',
    image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&h=400&fit=crop',
    rating: 4.5,
    reviewCount: 190,
    cookTime: '20 min',
    isVeg: true,
    isSpicy: false,
    tags: ['Premium'],
    category: 'pulao'
  },

  /* ================= INDIAN CHICKEN GRAVY (extended) ================= */
  {
    id: id++,
    name: 'Chicken Bharta',
    price: 250,
    description: 'Shredded chicken cooked with egg and rich masala gravy',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=400&fit=crop',
    rating: 4.6,
    reviewCount: 190,
    cookTime: '30 min',
    isVeg: false,
    isSpicy: true,
    tags: ['Popular'],
    category: 'indian-chicken'
  },
  {
    id: id++,
    name: 'Chicken Kolhapuri',
    price: 250,
    description: 'Spicy Maharashtrian chicken curry with bold flavors',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=400&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 220,
    cookTime: '32 min',
    isVeg: false,
    isSpicy: true,
    tags: ['Spicy'],
    category: 'indian-chicken'
  },
  {
    id: id++,
    name: 'Reshmi Butter Masala',
    price: 300,
    description: 'Creamy chicken gravy with mild spices and butter',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop',
    rating: 4.5,
    reviewCount: 170,
    cookTime: '28 min',
    isVeg: false,
    isSpicy: false,
    tags: ['Creamy'],
    category: 'indian-chicken'
  },

  /* ================= INDIAN VEG GRAVY ================= */
  {
    id: id++,
    name: 'Chana Paneer',
    price: 170,
    description: 'Chickpeas and paneer cooked in flavorful gravy',
    image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&h=400&fit=crop',
    rating: 4.4,
    reviewCount: 140,
    cookTime: '25 min',
    isVeg: true,
    isSpicy: false,
    tags: [],
    category: 'veg-curry'
  },
  {
    id: id++,
    name: 'Dal Makhni',
    price: 160,
    description: 'Creamy black lentils slow cooked with butter',
    image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa1e0c?w=400&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 210,
    cookTime: '35 min',
    isVeg: true,
    isSpicy: false,
    tags: ['Popular'],
    category: 'veg-curry'
  },
  {
    id: id++,
    name: 'Mix Veg Curry',
    price: 170,
    description: 'Seasonal vegetables cooked in traditional Indian gravy',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop',
    rating: 4.3,
    reviewCount: 130,
    cookTime: '22 min',
    isVeg: true,
    isSpicy: false,
    tags: [],
    category: 'veg-curry'
  },

  /* ================= BIRIYANI SPECIAL ================= */
  {
    id: id++,
    name: 'Special Chicken Biriyani',
    price: 360,
    description: 'Loaded chicken biriyani with extra masala and flavor',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 410,
    cookTime: '40 min',
    isVeg: false,
    isSpicy: true,
    tags: ['Bestseller'],
    category: 'biriyani'
  },
  {
    id: id++,
    name: 'Egg Biriyani',
    price: 150,
    description: 'Flavorful rice cooked with boiled eggs and spices',
    image: 'https://images.unsplash.com/photo-1625944525931-4a8b2ddb3f7b?w=400&h=400&fit=crop',
    rating: 4.4,
    reviewCount: 200,
    cookTime: '25 min',
    isVeg: false,
    isSpicy: false,
    tags: [],
    category: 'biriyani'
  },

  /* ================= ROTI & NAAN ================= */
  {
    id: id++,
    name: 'Butter Naan',
    price: 50,
    description: 'Soft naan brushed with butter',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop',
    rating: 4.6,
    reviewCount: 180,
    cookTime: '10 min',
    isVeg: true,
    isSpicy: false,
    tags: [],
    category: 'bread'
  },
  {
    id: id++,
    name: 'Garlic Naan',
    price: 70,
    description: 'Naan topped with fresh garlic and butter',
    image: 'https://images.unsplash.com/photo-1617196038435-2b4b5b1d1c9d?w=400&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 210,
    cookTime: '12 min',
    isVeg: true,
    isSpicy: false,
    tags: ['Popular'],
    category: 'bread'
  },

  /* ================= MOMO ================= */
  {
    id: id++,
    name: 'Fried Momo',
    price: 140,
    description: 'Crispy fried dumplings with spicy chutney',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=400&h=400&fit=crop',
    rating: 4.5,
    reviewCount: 230,
    cookTime: '18 min',
    isVeg: false,
    isSpicy: true,
    tags: ['Street Style'],
    category: 'momo'
  },
  {
    id: id++,
    name: 'Pan Fried Momo',
    price: 160,
    description: 'Pan fried dumplings with crispy base',
    image: 'https://images.unsplash.com/photo-1604908177225-d3e44c8e3a68?w=400&h=400&fit=crop',
    rating: 4.6,
    reviewCount: 180,
    cookTime: '20 min',
    isVeg: false,
    isSpicy: true,
    tags: [],
    category: 'momo'
  },

  /* ================= BEVERAGES ================= */
  {
    id: id++,
    name: 'Lassi',
    price: 90,
    description: 'Refreshing sweet yogurt-based drink',
    image: 'https://images.unsplash.com/photo-1625944525533-473f1e4e5e33?w=400&h=400&fit=crop',
    rating: 4.5,
    reviewCount: 150,
    cookTime: '5 min',
    isVeg: true,
    isSpicy: false,
    tags: ['Refreshing'],
    category: 'beverage'
  },
  {
    id: id++,
    name: 'Lemon Soda',
    price: 80,
    description: 'Chilled lemon soda with tangy flavor',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6c22?w=400&h=400&fit=crop',
    rating: 4.3,
    reviewCount: 120,
    cookTime: '5 min',
    isVeg: true,
    isSpicy: false,
    tags: [],
    category: 'beverage'
  }
];

/* ─────────────────────────────────────────────
   NORMALIZE  — maps raw API / fallback items
   to a consistent shape the entire UI relies on.
───────────────────────────────────────────── */
const normalize = (items = []) =>
  items.map((item, idx) => ({
    id: item.id || item._id || `fallback-${idx}`,
    name: item.name || "",
    description: item.description || item.desc || "",
    price: item.price ?? 0,
    image:
      item.image ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop",
    tags: Array.isArray(item.tags) ? item.tags : [],
    rating: typeof item.rating === "number" ? item.rating : 0,
    reviewCount: item.reviewCount || 0,
    cookTime: item.cookTime || "30 min",
    isVeg: item.isVeg ?? true,
    isSpicy: item.isSpicy ?? false,
    status: item.status || "available",
    type: item.type || item.category || "Main Course",
    category: item.category || item.type || "Main Course",
  }));

/* ─────────────────────────────────────────────
   PROVIDER
───────────────────────────────────────────── */
export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchMenu = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get("/menu");
        if (!mounted) return;

        const data = Array.isArray(res.data) ? res.data : [];

        if (data.length > 0) {
          //  API returned real items from the database
          setMenuItems(normalize(data));
        } else {
          //  API succeeded but DB is empty — show built-in menu so the UI is never blank
          console.warn(
            "[MenuContext] DB is empty — loading fallback menu data",
          );
          setMenuItems(normalize(getFallbackMenu()));
        }
      } catch (err) {
        if (!mounted) return;
        console.error(
          "[MenuContext] API unreachable — loading fallback menu data:",
          err.message,
        );
        //  Backend offline — still show a fully-working menu from fallback
        setMenuItems(normalize(getFallbackMenu()));
        setError(null); // suppress error UI; fallback keeps the app functional
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMenu();
    return () => {
      mounted = false;
    };
  }, []);

  /* ── CRUD helpers (used by admin panel) ── */
  const addMenuItem = (item) => {
    setMenuItems((prev) => [
      {
        ...item,
        id: Date.now(),
        image:
          item.image ||
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop",
        status: item.status || "available",
      },
      ...prev,
    ]);
  };

  const updateMenuItem = (updatedItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    );
  };

  const deleteMenuItem = (itemId) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        loading,
        error,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
