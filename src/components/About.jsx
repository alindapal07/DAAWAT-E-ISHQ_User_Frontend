import { Calendar, Heart, MapPin, Phone, Sparkles, Star } from 'lucide-react';

const About = () => {
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fdf2f8 0%, #fed7aa 50%, #fef3c7 100%)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '0'
  };

  const heroStyle = {
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center',
    padding: 'clamp(40px, 10vw, 80px) 16px',
  };

  const titleStyle = {
    fontSize: 'clamp(2rem, 6vw, 5rem)',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #dc2626, #ea580c, #d97706)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '16px',
    wordBreak: 'break-word'
  };

  const subtitleStyle = {
    fontSize: 'clamp(1rem, 4vw, 2rem)',
    color: '#374151',
    fontStyle: 'italic',
    fontWeight: '300',
    maxWidth: '90%',
    margin: '0 auto',
    lineHeight: '1.4'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: 'clamp(16px, 4vw, 24px)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: 'clamp(24px, 8vw, 48px)',
    margin: 'clamp(32px, 8vw, 64px) auto',
    maxWidth: '95%',
    position: 'relative',
    overflow: 'hidden'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
    gap: 'clamp(16px, 4vw, 24px)',
    marginBottom: '32px'
  };

  const gridItemStyle = {
    background: 'linear-gradient(135deg, #fef2f2, #fce7f3)',
    padding: 'clamp(16px, 4vw, 24px)',
    borderRadius: '16px',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    cursor: 'pointer'
  };

  const iconContainerStyle = {
    background: 'linear-gradient(135deg, #dc2626, #ea580c)',
    padding: '16px',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    animation: 'bounce 2s infinite'
  };

  const headingStyle = {
    fontSize: 'clamp(2rem, 6vw, 2.5rem)',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '24px',
    textAlign: 'center',
    wordBreak: 'break-word'
  };

  const valuesContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
    gap: 'clamp(24px, 6vw, 32px)',
    marginTop: '48px'
  };

  const valueItemStyle = {
    textAlign: 'center',
    padding: 'clamp(16px, 4vw, 32px)'
  };

  const storyContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
    gap: 'clamp(24px, 8vw, 48px)',
    alignItems: 'center',
    marginBottom: 'clamp(32px, 8vw, 64px)'
  };

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <div style={heroStyle}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'clamp(12px, 4vw, 24px)',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <Sparkles
            style={{
              color: '#f59e0b',
              width: 'clamp(24px, 6vw, 32px)',
              height: 'clamp(24px, 6vw, 32px)',
              animation: 'pulse 2s infinite',
              flexShrink: 0
            }}
          />
          <h1 style={titleStyle}>Daawat-E-Ishq</h1>
          <Sparkles
            style={{
              color: '#f59e0b',
              width: 'clamp(24px, 6vw, 32px)',
              height: 'clamp(24px, 6vw, 32px)',
              animation: 'pulse 2s infinite',
              flexShrink: 0
            }}
          />
        </div>
        <p style={subtitleStyle}>
          "Where every flavor tells a story, and every bite is made with love"
        </p>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        {/* Opening Announcement Card */}
        <div style={cardStyle}>
          <div style={{ textAlign: 'center' }}>
            <div style={iconContainerStyle}>
              <Heart
                style={{
                  color: 'white',
                  width: 'clamp(24px, 6vw, 32px)',
                  height: 'clamp(24px, 6vw, 32px)'
                }}
                fill="white"
              />
            </div>

            <h2 style={headingStyle}>We're Available for your service 🎉</h2>

            <p style={{
              fontSize: 'clamp(0.95rem, 3vw, 1.125rem)',
              color: '#374151',
              marginBottom: '32px',
              lineHeight: '1.7',
              maxWidth: '100%',
              margin: '0 auto 32px'
            }}>
              With great joy and heartfelt warmth, we are opening the doors to Daawat-E-Ishq –
              a place where tradition meets innovation, and every meal becomes a celebration of love.
            </p>

            {/* Opening Details Grid */}
            <div style={gridStyle}>
              <div style={gridItemStyle}>
                <MapPin
                  style={{
                    color: '#dc2626',
                    width: 'clamp(24px, 5vw, 32px)',
                    height: 'clamp(24px, 5vw, 32px)',
                    margin: '0 auto 12px'
                  }}
                />
                <h3 style={{
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '8px',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                }}>Location</h3>
                <p style={{
                  color: '#4b5563',
                  fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                  lineHeight: '1.5'
                }}>Dakbungalow More opposite Indian Silk House Gupta Colony, Barasat Kolkata, West Bengal</p>
              </div>

              <div style={gridItemStyle}>
                <Calendar
                  style={{
                    color: '#ea580c',
                    width: 'clamp(24px, 5vw, 32px)',
                    height: 'clamp(24px, 5vw, 32px)',
                    margin: '0 auto 12px'
                  }}
                />
                <h3 style={{
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '8px',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                }}>Working Hours</h3>
                <p style={{
                  color: '#4b5563',
                  fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                  lineHeight: '1.5'
                }}>Monday-Sunday: 12am–11pm</p>
              </div>

              <div style={gridItemStyle}>
                <Phone
                  style={{
                    color: '#d97706',
                    width: 'clamp(24px, 5vw, 32px)',
                    height: 'clamp(24px, 5vw, 32px)',
                    margin: '0 auto 12px'
                  }}
                />
                <h3 style={{
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '8px',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                }}>Contact</h3>
                <p style={{
                  color: '#4b5563',
                  fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                  lineHeight: '1.5'
                }}>9933344656</p>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #dc2626, #ea580c)',
              color: 'white',
              padding: 'clamp(16px, 4vw, 24px)',
              borderRadius: '16px',
              marginTop: '32px'
            }}>
              <p style={{
                fontSize: 'clamp(0.95rem, 3vw, 1.125rem)',
                fontWeight: '500',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Your presence will make this beginning even more beautiful.
                Come, be a part of our journey, and celebrate love through food. ✨
              </p>
            </div>
          </div>
        </div>

        {/* Our Story Section */}
        <div style={storyContainerStyle}>
          <div>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px'
            }}>Our Story</h2>
            <div style={{
              width: '80px',
              height: '4px',
              background: 'linear-gradient(135deg, #dc2626, #ea580c)',
              borderRadius: '2px',
              marginBottom: '24px'
            }}></div>
            <p style={{
              fontSize: 'clamp(0.95rem, 3vw, 1.125rem)',
              color: '#374151',
              lineHeight: '1.7',
              marginBottom: '20px'
            }}>
              Our journey began with a vision to bring age-old recipes to modern plates,
              offering a culinary experience that delights every palate and touches every heart.
            </p>
            <p style={{
              fontSize: 'clamp(0.95rem, 3vw, 1.125rem)',
              color: '#374151',
              lineHeight: '1.7'
            }}>
              At Daawat-E-Ishq, we specialize in authentic Indian cuisine, blending rich spices,
              fresh ingredients, and generations of love in every dish we serve.
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #fef2f2, #fed7aa)',
            padding: 'clamp(20px, 6vw, 32px)',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    style={{
                      color: '#f59e0b',
                      width: 'clamp(20px, 5vw, 32px)',
                      height: 'clamp(20px, 5vw, 32px)'
                    }}
                    fill="#f59e0b"
                  />
                ))}
              </div>
              <h3 style={{
                fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '16px'
              }}>Our Promise</h3>
              <p style={{
                color: '#374151',
                fontStyle: 'italic',
                lineHeight: '1.6',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)'
              }}>
                "From family dinners to festive occasions, we aim to make every meal
                memorable with authentic flavors and heartwarming hospitality."
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: 'clamp(16px, 4vw, 24px)',
          padding: 'clamp(24px, 8vw, 48px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          marginBottom: 'clamp(32px, 8vw, 64px)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={headingStyle}>What Makes Us Special</h2>
            <div style={{
              width: '80px',
              height: '4px',
              background: 'linear-gradient(135deg, #dc2626, #ea580c)',
              borderRadius: '2px',
              margin: '0 auto'
            }}></div>
          </div>

          <div style={valuesContainerStyle}>
            <div style={valueItemStyle}>
              <div style={{
                background: 'linear-gradient(135deg, #dc2626, #f43f5e)',
                padding: '16px',
                borderRadius: '16px',
                width: 'clamp(70px, 15vw, 80px)',
                height: 'clamp(70px, 15vw, 80px)',
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Heart
                  style={{
                    color: 'white',
                    width: 'clamp(24px, 6vw, 32px)',
                    height: 'clamp(24px, 6vw, 32px)'
                  }}
                  fill="white"
                />
              </div>
              <h3 style={{
                fontSize: 'clamp(1.1rem, 3vw, 1.25rem)',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '12px'
              }}>Made with Love</h3>
              <p style={{
                color: '#4b5563',
                lineHeight: '1.6',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)'
              }}>
                Every dish is crafted with passion, care, and the warmth of traditional home cooking.
              </p>
            </div>

            <div style={valueItemStyle}>
              <div style={{
                background: 'linear-gradient(135deg, #ea580c, #d97706)',
                padding: '16px',
                borderRadius: '16px',
                width: 'clamp(70px, 15vw, 80px)',
                height: 'clamp(70px, 15vw, 80px)',
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles
                  style={{
                    color: 'white',
                    width: 'clamp(24px, 6vw, 32px)',
                    height: 'clamp(24px, 6vw, 32px)'
                  }}
                />
              </div>
              <h3 style={{
                fontSize: 'clamp(1.1rem, 3vw, 1.25rem)',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '12px'
              }}>Authentic Flavors</h3>
              <p style={{
                color: '#4b5563',
                lineHeight: '1.6',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)'
              }}>
                Rich spices, fresh ingredients, and time-honored recipes create unforgettable taste experiences.
              </p>
            </div>

            <div style={valueItemStyle}>
              <div style={{
                background: 'linear-gradient(135deg, #d97706, #eab308)',
                padding: '16px',
                borderRadius: '16px',
                width: 'clamp(70px, 15vw, 80px)',
                height: 'clamp(70px, 15vw, 80px)',
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Star
                  style={{
                    color: 'white',
                    width: 'clamp(24px, 6vw, 32px)',
                    height: 'clamp(24px, 6vw, 32px)'
                  }}
                  fill="white"
                />
              </div>
              <h3 style={{
                fontSize: 'clamp(1.1rem, 3vw, 1.25rem)',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '12px'
              }}>Warm Hospitality</h3>
              <p style={{
                color: '#4b5563',
                lineHeight: '1.6',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)'
              }}>
                Our passionate team creates not just great food, but also a welcoming atmosphere for all.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{
          textAlign: 'center',
          marginTop: 'clamp(32px, 8vw, 64px)',
          marginBottom: 'clamp(32px, 8vw, 64px)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #dc2626, #ea580c, #d97706)',
            color: 'white',
            padding: 'clamp(24px, 8vw, 48px)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px rgba(220, 38, 38, 0.3)'
          }}>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 6vw, 3rem)',
              fontWeight: 'bold',
              marginBottom: '24px',
              wordBreak: 'break-word'
            }}>
              Join Our Culinary Journey
            </h2>
            <p style={{
              fontSize: 'clamp(0.95rem, 3vw, 1.25rem)',
              marginBottom: '32px',
              opacity: '0.9',
              maxWidth: '100%',
              margin: '0 auto 32px',
              lineHeight: '1.6'
            }}>
              Come, be a part of our story and savor the taste of tradition with a modern twist.
              Experience the magic where flavors meet emotions.
            </p>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              padding: 'clamp(12px, 4vw, 16px) clamp(20px, 6vw, 32px)',
              borderRadius: '50px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              display: 'inline-block'
            }}>
              <p style={{
                fontSize: 'clamp(0.85rem, 2vw, 1.125rem)',
                fontWeight: '500',
                margin: 0,
                lineHeight: '1.6'
              }}>
                At Dakbungalow More opposite Indian Silk House Gupta Colony, Barasat Kolkata, West Bengal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;