import { Calendar, Edit2, Eye, LogOut, Play, Plus, Search, Trash2, Upload, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import '../pages/Blog.css';

const BlogPlatform = () => {
  const [blogs, setBlogs] = useState(() => {
    const stored = sessionStorage.getItem('blogs');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadType, setUploadType] = useState('image'); // 'image' or 'video'
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Technology',
    media: null,
    mediaType: null,
    mediaBase64: null,
  });

  useEffect(() => {
    try {
      // Store blogs without mediaBase64 to avoid quota issues
      const blogsForStorage = blogs.map(blog => ({
        ...blog,
        mediaBase64: undefined // Exclude large base64 data
      }));
      sessionStorage.setItem('blogs', JSON.stringify(blogsForStorage));
    } catch (error) {
      console.warn('Failed to save blogs to sessionStorage:', error);
      // Optionally clear some old blogs if quota exceeded
      if (error.name === 'QuotaExceededError') {
        const reducedBlogs = blogs.slice(-5); // Keep only last 5 blogs
        const reducedForStorage = reducedBlogs.map(blog => ({
          ...blog,
          mediaBase64: undefined
        }));
        try {
          sessionStorage.setItem('blogs', JSON.stringify(reducedForStorage));
        } catch (e) {
          console.error('Still unable to save blogs:', e);
        }
      }
    }
  }, [blogs]);

  const handleLogin = (role) => {
    setCurrentUser(role === 'admin' ? 'Admin User' : `User ${Math.random().toString(36).substr(2, 9)}`);
    setIsAdmin(role === 'admin');
    setActiveTab('browse');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setShowForm(false);
    setEditingId(null);
    setUploadPreview(null);
    setFormData({ title: '', excerpt: '', content: '', category: 'Technology', media: null, mediaType: null, mediaBase64: null });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      const isVideo = file.type.startsWith('video/');
      
      setFormData({
        ...formData,
        media: file.name,
        mediaType: isVideo ? 'video' : 'image',
        mediaBase64: base64,
      });
      
      setUploadPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleAddBlog = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in title and content');
      return;
    }

    if (editingId) {
      setBlogs(blogs.map(blog =>
        blog.id === editingId
          ? { 
              ...blog, 
              title: formData.title,
              excerpt: formData.excerpt,
              content: formData.content,
              category: formData.category,
              media: formData.media || blog.media,
              mediaType: formData.mediaType || blog.mediaType,
              mediaBase64: formData.mediaBase64 || blog.mediaBase64,
              updatedAt: new Date().toLocaleString() 
            }
          : blog
      ));
      setEditingId(null);
    } else {
      const newBlog = {
        id: Date.now(),
        ...formData,
        author: currentUser,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        views: Math.floor(Math.random() * 500),
      };
      setBlogs([newBlog, ...blogs]);
    }

    setFormData({ title: '', excerpt: '', content: '', category: 'Technology', media: null, mediaType: null, mediaBase64: null });
    setUploadPreview(null);
    setShowForm(false);
  };

  const handleEditBlog = (blog) => {
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      media: blog.media,
      mediaType: blog.mediaType,
      mediaBase64: blog.mediaBase64,
    });
    setUploadPreview(blog.mediaBase64);
    setEditingId(blog.id);
    setShowForm(true);
    setActiveTab('edit');
  };

  const handleDeleteBlog = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      setBlogs(blogs.filter(blog => blog.id !== id));
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!currentUser) {
    return (
      <div className="blog-login-container">
        <div className="blog-login-box">
          <div className="blog-login-header">
            <h1 className="blog-title">BlogHub</h1>
            <p className="blog-subtitle">Share your stories with photos & videos</p>
          </div>
          <div className="blog-login-buttons">
            <button
              onClick={() => handleLogin('user')}
              className="blog-btn blog-btn-primary"
            >
              Login as User
            </button>
            <button
              onClick={() => handleLogin('admin')}
              className="blog-btn blog-btn-admin"
            >
              Login as Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-main-container">
      {/* Navigation Tabs */}
      <div className="blog-nav-tabs">
        <div className="blog-nav-content">
          <button
            onClick={() => { setActiveTab('browse'); setShowForm(false); }}
            className={`blog-tab ${activeTab === 'browse' ? 'blog-tab-active' : ''}`}
          >
            📚 Browse Blogs
          </button>
          {currentUser && (
            <button
              onClick={() => { setActiveTab('myblogs'); setShowForm(false); }}
              className={`blog-tab ${activeTab === 'myblogs' ? 'blog-tab-active' : ''}`}
            >
              ✍️ My Blogs
            </button>
          )}
          <div className="blog-header-right">
            <div className="blog-user-badge">
              <User className="blog-icon-small" />
              <span>{currentUser}</span>
            </div>
            <button
              onClick={handleLogout}
              className="blog-logout-btn"
              title="Logout"
            >
              <LogOut className="blog-icon-small" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="blog-main-content">
        {/* Create Blog Form */}
        {showForm && (
          <div className="blog-form-container">
            <h2 className="blog-form-title">
              {editingId ? '✏️ Edit Blog' : '✨ Create New Blog'}
            </h2>
            <div className="blog-form">
              <input
                type="text"
                placeholder="Blog Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="blog-input"
              />
              <input
                type="text"
                placeholder="Brief Excerpt (optional)"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="blog-input"
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="blog-input"
              >
                <option>Technology</option>
                <option>Lifestyle</option>
                <option>Travel</option>
                <option>Food</option>
                <option>Business</option>
                <option>Other</option>
              </select>
              <textarea
                placeholder="Write your blog content here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows="6"
                className="blog-textarea"
              />

              {/* Media Upload Section */}
              <div className="blog-media-section">
                <label className="blog-media-label">📸 Add Photo or Video (Optional)</label>
                <div className="blog-media-tabs">
                  <button
                    type="button"
                    className={`blog-media-tab ${uploadType === 'image' ? 'active' : ''}`}
                    onClick={() => setUploadType('image')}
                  >
                    📷 Photo
                  </button>
                  <button
                    type="button"
                    className={`blog-media-tab ${uploadType === 'video' ? 'active' : ''}`}
                    onClick={() => setUploadType('video')}
                  >
                    🎥 Video
                  </button>
                </div>

                <label className="blog-file-upload">
                  <Upload className="blog-icon-small" />
                  <span>{uploadPreview ? 'Change File' : 'Click to Upload'}</span>
                  <input
                    type="file"
                    accept={uploadType === 'image' ? 'image/*' : 'video/*'}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>

                {uploadPreview && (
                  <div className="blog-preview-container">
                    <div className="blog-preview-header">
                      <span>Preview</span>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadPreview(null);
                          setFormData({ ...formData, media: null, mediaType: null, mediaBase64: null });
                        }}
                        className="blog-remove-media"
                      >
                        <X className="blog-icon-small" />
                      </button>
                    </div>
                    {formData.mediaType === 'video' ? (
                      <video src={uploadPreview} controls className="blog-preview-media" />
                    ) : (
                      <img src={uploadPreview} alt="Preview" className="blog-preview-media" />
                    )}
                  </div>
                )}
              </div>

              <div className="blog-form-buttons">
                <button
                  onClick={handleAddBlog}
                  className="blog-btn blog-btn-publish"
                >
                  {editingId ? 'Update Blog' : 'Publish Blog'}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setUploadPreview(null);
                    setFormData({ title: '', excerpt: '', content: '', category: 'Technology', media: null, mediaType: null, mediaBase64: null });
                  }}
                  className="blog-btn blog-btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Button */}
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setUploadPreview(null);
              setFormData({ title: '', excerpt: '', content: '', category: 'Technology', media: null, mediaType: null, mediaBase64: null });
              setActiveTab('edit');
            }}
            className="blog-btn blog-btn-create"
          >
            <Plus className="blog-icon" /> Create New Blog
          </button>
        )}

        {/* Search Bar */}
        <div className="blog-search-container">
          <Search className="blog-search-icon" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="blog-search-input"
          />
        </div>

        {/* Blogs Grid */}
        {activeTab === 'browse' && (
          <div className="blog-grid">
            {filteredBlogs.length === 0 ? (
              <div className="blog-empty-state">
                <p>No blogs found. Be the first to create one!</p>
              </div>
            ) : (
              filteredBlogs.map(blog => (
                <div key={blog.id} className="blog-card">
                  {blog.mediaBase64 && (
                    <div className="blog-card-media">
                      {blog.mediaType === 'video' ? (
                        <>
                          <video src={blog.mediaBase64} className="blog-card-image" />
                          <div className="blog-video-overlay">
                            <Play className="blog-icon" />
                          </div>
                        </>
                      ) : (
                        <img src={blog.mediaBase64} alt={blog.title} className="blog-card-image" />
                      )}
                    </div>
                  )}
                  <div className="blog-card-content">
                    <div className="blog-card-header">
                      <span className="blog-category-badge">{blog.category}</span>
                      {(isAdmin || blog.author === currentUser) && (
                        <div className="blog-card-actions">
                          <button
                            onClick={() => handleEditBlog(blog)}
                            className="blog-action-btn blog-edit-btn"
                            title="Edit"
                          >
                            <Edit2 className="blog-icon-tiny" />
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="blog-action-btn blog-delete-btn"
                            title="Delete"
                          >
                            <Trash2 className="blog-icon-tiny" />
                          </button>
                        </div>
                      )}
                    </div>
                    <h3 className="blog-card-title">{blog.title}</h3>
                    <p className="blog-card-excerpt">{blog.excerpt || blog.content.substring(0, 100)}...</p>
                    <div className="blog-card-meta">
                      <div className="blog-meta-item">
                        <User className="blog-icon-tiny" />
                        {blog.author}
                      </div>
                      <div className="blog-meta-item">
                        <Calendar className="blog-icon-tiny" />
                        {blog.createdAt.split(',')[0]}
                      </div>
                      <div className="blog-meta-item">
                        <Eye className="blog-icon-tiny" />
                        {blog.views} views
                      </div>
                    </div>
                    <button className="blog-read-more-btn">Read More</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* My Blogs Tab */}
        {activeTab === 'myblogs' && (
          <div className="blog-grid">
            {blogs.filter(b => b.author === currentUser).length === 0 ? (
              <div className="blog-empty-state">
                <p>You haven't created any blogs yet.</p>
              </div>
            ) : (
              blogs.filter(b => b.author === currentUser).map(blog => (
                <div key={blog.id} className="blog-card">
                  {blog.mediaBase64 && (
                    <div className="blog-card-media">
                      {blog.mediaType === 'video' ? (
                        <>
                          <video src={blog.mediaBase64} className="blog-card-image" />
                          <div className="blog-video-overlay">
                            <Play className="blog-icon" />
                          </div>
                        </>
                      ) : (
                        <img src={blog.mediaBase64} alt={blog.title} className="blog-card-image" />
                      )}
                    </div>
                  )}
                  <div className="blog-card-content">
                    <div className="blog-card-header">
                      <span className="blog-category-badge">{blog.category}</span>
                      <div className="blog-card-actions">
                        <button
                          onClick={() => handleEditBlog(blog)}
                          className="blog-action-btn blog-edit-btn"
                        >
                          <Edit2 className="blog-icon-tiny" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="blog-action-btn blog-delete-btn"
                        >
                          <Trash2 className="blog-icon-tiny" />
                        </button>
                      </div>
                    </div>
                    <h3 className="blog-card-title">{blog.title}</h3>
                    <p className="blog-card-excerpt">{blog.excerpt || blog.content.substring(0, 100)}...</p>
                    <div className="blog-card-meta">
                      <div className="blog-meta-item">
                        <Calendar className="blog-icon-tiny" />
                        {blog.updatedAt.split(',')[0]}
                      </div>
                      <div className="blog-meta-item">
                        <Eye className="blog-icon-tiny" />
                        {blog.views} views
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogPlatform;