import { ChevronDown, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import MenuItemCard from '../components/menu/MenuItemCard';
import './Menu.css';
import butterChickenImg from '../Assets/butterchicken.jpg';
import ElishImg from '../Assets/Elish.jpg';
import kachiiImg from '../Assets/kachii-biriyani.jpg';
import paneerImg from '../Assets/paneer-butter-masala.png'; 
/* -----------------------------------------------------------------------
   GALLERY ASSETS
   Imported statically so Webpack can hash and cache them correctly.
----------------------------------------------------------------------- */
import Slide1 from '../Assets/MENU/Slide1.PNG';
import Slide2 from '../Assets/MENU/Slide2.PNG';
import Slide3 from '../Assets/MENU/Slide3.PNG';
import Slide4 from '../Assets/MENU/Slide4.PNG';
import Slide5 from '../Assets/MENU/Slide5.PNG';

/* -----------------------------------------------------------------------
   FALLBACK IMAGE
   Displayed when an individual dish image URL is broken or unreachable.
----------------------------------------------------------------------- */
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop';

/* -----------------------------------------------------------------------
   SORT OPTIONS
   Defined at module level so the array reference is stable across renders.
----------------------------------------------------------------------- */
const SORT_OPTIONS = [
  { value: 'popular',    label: 'Sort by Popularity' },
  { value: 'rating',     label: 'Top Rated'           },
  { value: 'price-low',  label: 'Price: Low to High'  },
  { value: 'price-high', label: 'Price: High to Low'  },
];

/* -----------------------------------------------------------------------
   MENU ITEMS — STATIC DATA
   Kept inline because this page is client-side only; it does not depend
   on the API. Each item includes rating, reviewCount, cookTime and tags
   so MenuItemCard can render them without extra fetching.
----------------------------------------------------------------------- */
let id = 1; // incrementing id generator — reset each module load

const menuItemsData = [
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

/* -----------------------------------------------------------------------
   CATEGORIES — TAB FILTERS
   Each entry maps the filter key (matches item.category) to a display name.
----------------------------------------------------------------------- */
const categories = [
  { key: 'signature',       name: 'Signature',       img:'https://i.pinimg.com/1200x/a0/d0/6b/a0d06bf6cd3f1585089f657989555973.jpg' },
  { key: 'salads',          name: 'Salads',          img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&h=120&fit=crop' },
  { key: 'soups',           name: 'Soups',           img: 'https://i.pinimg.com/webp/1200x/23/b4/61/23b461e8e56256cb47ba152a8ff58b4c.webp' },
  { key: 'fried-rice',      name: 'Fried Rice',      img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=120&h=120&fit=crop' },
  { key: 'noodles',         name: 'Noodles',         img: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=120&h=120&fit=crop' },
  { key: 'pulao',           name: 'Pulao',           img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=120&h=120&fit=crop' },
  { key: 'biriyani',        name: 'Biriyani',        img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120&h=120&fit=crop' },
  { key: 'indian-chicken',  name: 'Chicken Curry',   img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=120&h=120&fit=crop' },
  { key: 'mutton',          name: 'Mutton',          img: 'https://i.pinimg.com/736x/e9/a5/92/e9a592bc11a55224937245014387e1d0.jpg' },
  { key: 'veg-curry',       name: 'Veg Curry',       img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=120&h=120&fit=crop' },
  { key: 'kebab',           name: 'Kebab',           img: 'https://i.pinimg.com/1200x/24/f1/82/24f182fef5b691f3b3eb4c9499bb7eae.jpg' },
  { key: 'tandoori',        name: 'Tandoori',        img: 'https://www.cubesnjuliennes.com/wp-content/uploads/2022/12/Tandoori-Chicken-Recipe.jpg' },
  { key: 'chinese-chicken', name: 'Chinese Chicken', img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=120&h=120&fit=crop' },
  { key: 'chinese-fish',    name: 'Chinese Fish',    img: 'https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=120&h=120&fit=crop' },
  { key: 'prawns',          name: 'Prawns',          img: 'https://i.pinimg.com/1200x/07/ac/e0/07ace043293bc3047be4f8e3cf8b2212.jpg' },
  { key: 'momo',            name: 'Momo',            img: 'https://i.pinimg.com/1200x/e8/35/ed/e835ed89023c2a6d2d1933321d59efc4.jpg' },
  { key: 'bread',           name: 'Roti & Naan',     img: 'https://i.pinimg.com/1200x/2d/a9/1f/2da91f6ba703b9a7fd6b6264db7a9fc1.jpg' },
  { key: 'rice',            name: 'Rice',            img: 'https://i.pinimg.com/1200x/35/67/89/356789c8c178906a6585d2fcbe27387c.jpg' },
  { key: 'tadka',           name: 'Tadka Special',   img: 'https://i.pinimg.com/1200x/df/99/a6/df99a6684cb8c69d9d764f5d5ec5b7c0.jpg' },
  { key: 'beverage',        name: 'Beverage',       img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=120&h=120&fit=crop' },
];

/* -----------------------------------------------------------------------
   DIVIDERS
   Visual separators rendered before these category keys to group related
   sections — matches the Zomato-style strip layout.
----------------------------------------------------------------------- */
const DIVIDERS_BEFORE = new Set([
  'fried-rice', 'pulao', 'signature', 'indian-chicken',
  'kebab', 'chinese-chicken', 'momo', 'rice', 'beverages',
]);

/* -----------------------------------------------------------------------
   CATEGORY PILL
   Single circular image pill used in the horizontal filter strip.
   Mirrors Zomato's rounded-image filter button pattern.
----------------------------------------------------------------------- */
const CategoryPill = ({ cat, isActive, onClick }) => {
  const ACTIVE_COLOR = '#e8401c';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`category-pill${isActive ? ' category-pill--active' : ''}`}
      aria-pressed={isActive}
    >
      <div
        className="category-pill__ring"
        style={{
          borderColor: isActive ? ACTIVE_COLOR : undefined,
          boxShadow: isActive ? `0 0 0 2px ${ACTIVE_COLOR}22` : undefined,
          background: cat === null
            ? 'linear-gradient(135deg, #ff6b35, #f7931e)'
            : undefined,
        }}
      >
        {cat === null ? (
          /* "All Items" pill — gradient background, text label */
          <span className="category-pill__all-label">All</span>
        ) : cat.img ? (
          <img
            src={cat.img}
            alt={cat.name}
            className="category-pill__img"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextSibling.style.display = 'flex';
            }}
          />
        ) : (
          /* Signature — star fallback */
          <span className="category-pill__emoji">⭐</span>
        )}

        {/* Hidden emoji shown only when the img fails to load */}
        {cat !== null && cat.img && (
          <span className="category-pill__emoji" style={{ display: 'none' }}>
            {cat.key === 'beverages' ? '🥤' : '🍽️'}
          </span>
        )}
      </div>

      <span
        className="category-pill__label"
        style={{ color: isActive ? ACTIVE_COLOR : undefined, fontWeight: isActive ? 500 : undefined }}
      >
        {cat === null ? 'All Items' : cat.name}
      </span>
    </button>
  );
};

/* -----------------------------------------------------------------------
   CUSTOM SORT DROPDOWN
   Reusable animated dropdown that replaces the native <select> element.
   The options list animates in with a scale + fade transition.

   Props:
     value    - currently selected sort key string
     onChange - callback fired with the newly selected value
     options  - array of { value, label } objects
----------------------------------------------------------------------- */
const SortDropdown = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  /* Close the panel when user clicks outside the dropdown */
  useEffect(() => {
    const onOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  /* Find the label that corresponds to the currently active value */
  const selectedLabel = options.find((o) => o.value === value)?.label || options[0].label;

  const handleSelect = (v) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div className="menu-sort-dropdown" ref={ref}>
      {/* Trigger — always visible, shows current selection + spinning chevron */}
      <button
        type="button"
        className={`menu-sort-trigger${open ? ' menu-sort-trigger--open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selectedLabel}</span>
        <ChevronDown size={16} className="menu-sort-chevron" />
      </button>

      {/* Animated options panel */}
      <ul
        className={`menu-sort-list${open ? ' menu-sort-list--open' : ''}`}
        role="listbox"
        aria-label="Sort menu items"
      >
        {options.map((opt) => (
          <li
            key={opt.value}
            role="option"
            aria-selected={opt.value === value}
            className={`menu-sort-option${opt.value === value ? ' menu-sort-option--active' : ''}`}
            onMouseDown={() => handleSelect(opt.value)}
          >
            {/* Active indicator dot — filled only when this option is selected */}
            <span className="menu-sort-dot" />
            {opt.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

/* -----------------------------------------------------------------------
   MENU PAGE
----------------------------------------------------------------------- */
const MenuPage = () => {
  const [searchTerm, setSearchTerm]             = useState('');
  const [sortBy, setSortBy]                     = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState('all');

  /* Compute the filtered + sorted list whenever dependencies change */
  const filteredItems = useMemo(() => {
    let items = [...menuItemsData];

    /* Text search — matches against dish name only */
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter((item) =>
        item.name.toLowerCase().includes(term)
      );
    }

    /* Category tab filter */
    if (selectedCategory !== 'all') {
      items = items.filter((item) =>
        selectedCategory === 'signature'
          ? item.tags.includes('Signature Dish')
          : item.category === selectedCategory
      );
    }

    /* Sort */
    switch (sortBy) {
      case 'price-low':
        return items.sort((a, b) => a.price - b.price);
      case 'price-high':
        return items.sort((a, b) => b.price - a.price);
      case 'rating':
        return items.sort((a, b) => b.rating - a.rating);
      default:
        /* 'popular' — Bestsellers float to the top */
        return items.sort(
          (a, b) =>
            (b.tags.includes('Bestseller') || b.tags.includes('popular') || b.tags.includes('Signature Dish') ? 1 : 0) -
            (a.tags.includes('Bestseller') || a.tags.includes('popular') || a.tags.includes('Signature Dish') ? 1 : 0)
        );
    }
  }, [searchTerm, selectedCategory, sortBy]);

  /* ------------------------------------------------------------------
     RENDER
  ------------------------------------------------------------------ */
  return (
    <div className="menu-page">

      {/* Page hero header */}
      <header className="menu-header">
        <h1>Our Exquisite Menu</h1>
        <p>Discover a world of flavors crafted with passion.</p>
      </header>

      {/* Menu gallery — horizontal scrollable image strip */}
      <div className="menu-banner">
        <div className="menu-banner-inner container">
          <div className="menu-banner-heading">
            <h3 className="menu-banner-title">Daawat-e-Ishq Menu</h3>
            <p className="menu-banner-subtitle">
              Explore our full menu — authentic flavors and chef specials
            </p>
          </div>

          <div className="menu-banner-gallery" role="list" aria-label="Daawat-e-Ishq menu images">
            {[Slide1, Slide2, Slide3, Slide4, Slide5].map((src, idx) => (
              <div key={idx} className="menu-banner-item" role="listitem">
                <img
                  src={src}
                  alt={`Daawat-e-Ishq menu page ${idx + 1}`}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container">

        {/* Sticky search + sort controls bar */}
        <div className="menu-controls">

          {/* Live search input */}
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              placeholder="Search for your favorite dish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Custom animated sort dropdown */}
          <SortDropdown
            value={sortBy}
            onChange={setSortBy}
            options={SORT_OPTIONS}
          />
        </div>

        {/* ---------------------------------------------------------------
            CATEGORY FILTER — Zomato-style horizontal scroll strip
            Circular food-image pills with active orange ring indicator.
            Thin vertical dividers group related cuisine sections visually.
        --------------------------------------------------------------- */}
        <nav className="category-filters" aria-label="Filter by category">

          {/* "All Items" anchor pill */}
          <CategoryPill
            cat={null}
            isActive={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
          />

          {categories.map((cat) => (
            <div key={cat.key} className="category-pill-wrapper">
              {/* Section divider — rendered before grouping boundaries */}
              {DIVIDERS_BEFORE.has(cat.key) && (
                <div className="category-divider" aria-hidden="true" />
              )}

              <CategoryPill
                cat={cat}
                isActive={selectedCategory === cat.key}
                onClick={() => setSelectedCategory(cat.key)}
              />
            </div>
          ))}
        </nav>

        {/* Menu card grid */}
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default MenuPage; 