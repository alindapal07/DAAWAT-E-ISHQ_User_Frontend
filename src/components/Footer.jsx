import {
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="modern-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Us</h4>
            <div className="contact-item">
              <MapPin size={18} className="contact-icon" />
              <span>Dak-banglow More, Barasaat, North 24 Parganas</span>
            </div>
            <div className="contact-item">
              <Phone size={18} className="contact-icon" />
              <span>7001365854</span>
            </div>
            <div className="contact-item">
              <Mail size={18} className="contact-icon" />
              <span>
                <a 
                 
                  href="mailto:Daawateishq.restro@gmail.com"
                  class="footer-email"
                >
                  Daawateishq.restro@gmail.com
                </a>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <div className="quick-links">
              <Link to="/reviews" className="footer-link">
                Reviews
              </Link>
              <Link to="/about" className="footer-link">
                About Us
              </Link>
              <Link to="/contact" className="footer-link">
                Contact
              </Link>
            </div>
          </div>

          {/* Brand & Social */}
          <div className="footer-section brand-section">
            <h4 className="brand-logo">Daawat-E-Ishq</h4>
            <p className="brand-tagline">
              Where every meal is a love story, crafted with passion and served
              with heart.
            </p>

            <div className="social-links">
              <a
                href="https://www.facebook.com/Daawateishqbarasat/"
                className="social-link"
                title="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com/daawateishq"
                className="social-link"
                title="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.instagram.com/daawateishq"
                className="social-link"
                title="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="copyright">
            <Heart
              size={16}
              style={{
                display: "inline",
                marginRight: "8px",
                color: "#f59e0b",
              }}
            />
            &copy; 2025 Daawat-E-Ishq. All rights reserved. Made with love for
            food lovers.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
