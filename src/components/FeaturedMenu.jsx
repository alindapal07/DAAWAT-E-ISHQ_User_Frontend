 import { Clock, Star, Users } from 'lucide-react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import butterChickenImg from '../Assets/butterchicken.jpg';
import ElishImg from '../Assets/Elish.jpg';
import kachiiImg from '../Assets/kachii-biriyani.jpg';
import paneerImg from '../Assets/paneer-butter-masala.png';
import { CartContext } from '../context/CartContext';


const FeaturedMenu = () => {
  const { addToCart } = useContext(CartContext);
  
  const handleAddToCart = (item) => {
    addToCart(item);
  };
const featuredItems = [
  {
    id: 1,
    name: 'Kachii Biryani',
    description: 'Aromatic basmati rice with tender mutton, cooked in traditional dum style',
    price: 499,
    image: kachiiImg,
    rating: 4.9,
    cookTime: '45 min',
    serves: '2-3 people',
    isSpecial: true
  },
    {
    id: 2,
    name: 'Ilish Pulao (Full)',
    description: 'Ilish Pulao is a fragrant Bengali delicacy where tender hilsa fish is gently cooked with aromatic gobindobhog rice, whole spices, and subtle mustard notes, creating a rich, delicate balance of flavor and tradition.',
    price: 490,
    image: ElishImg,
    rating: 4.9,
    cookTime: '25 min',
    serves: '2 people',
    isSpecial: false
  },
  {
    id: 3,
    name: 'Butter Chicken',
    description: 'Creamy tomato-based curry with succulent chicken pieces',
    price: 399,
    image: butterChickenImg,
    rating: 4.8,
    cookTime: '30 min',
    serves: '2 people',
    isSpecial: false
  },
  {
    id: 4,
    name: 'Paneer butter masala',
    description: 'Rich and creamy cottage cheese curry with aromatic spices',
    price: 349,
    image: paneerImg,
    rating: 4.7,
    cookTime: '25 min',
    serves: '2 people',
    isSpecial: false
  }
];


  return (
    <section className="featured-menu">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Our Signature Dishes</h2>
          <p className="section-subtitle">Handpicked favorites that define our culinary excellence</p>
        </div>
        
        <div className="featured-grid">
          {featuredItems.map((item, index) => (
            <div key={item.id} className={`featured-card ${index === 0 ? 'featured-highlight' : ''}`}>
              {item.isSpecial && <div className="special-badge">Chef's Special</div>}
              
              <div className="card-image">
                <img src={item.image} alt={item.name} />
                <div className="card-overlay">
                  <button className="quick-view-btn">Quick View</button>
                </div>
              </div>
              
              <div className="card-content">
                <div className="card-header">
                  <h3 className="dish-name">{item.name}</h3>
                  <span className="dish-price">₹{item.price}</span>
                </div>
                
                <p className="dish-description">{item.description}</p>
                
                <div className="dish-meta">
                  <div className="meta-item">
                    <Star size={16} fill="currentColor" />
                    <span>{item.rating}</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{item.cookTime}</span>
                  </div>
                  <div className="meta-item">
                    <Users size={16} />
                    <span>{item.serves}</span>
                  </div>
                </div>
                
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="section-footer">
          <Link to="/menu" className="btn btn-primary">View Full Menu</Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMenu;