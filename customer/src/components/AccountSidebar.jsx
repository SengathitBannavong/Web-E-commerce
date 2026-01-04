import { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { deleteProfileImage, uploadProfileImage } from '../services/userService';
import './AccountSidebar.css';

export const AccountSidebar = ({ user, menuItems }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const { setUser } = useAuth();
  const { showToast } = useToast();

  if (!user) return null;
  const tempAvata = "https://res.cloudinary.com/dskodfe9c/image/upload/v1767510418/temp_profile_selxqo.jpg";
  const [avatarSrc] = useState(user.Profile_URL || tempAvata);
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be less than 5MB', 'error');
      return;
    }

    try {
      setIsUploading(true);
      const response = await uploadProfileImage(file);
      
      // Update user context with new image URL
      setUser(prev => ({
        ...prev,
        Photo_URL: response.imageUrl
      }));

      showToast('Profile picture updated successfully!', 'success');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showToast('Failed to upload image. Please try again.', 'error');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAvatar = async (e) => {
    e.stopPropagation();
    
    if (!user.Photo_URL || user.Photo_URL === tempAvatar) {
      showToast('No custom avatar to delete', 'info');
      return;
    }

    if (!window.confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }

    try {
      setIsUploading(true);
      await deleteProfileImage();
      
      // Update user context to default image
      setUser(prev => ({
        ...prev,
        Photo_URL: null
      }));

      showToast('Profile picture removed successfully!', 'success');
    } catch (error) {
      console.error('Error deleting avatar:', error);
      showToast('Failed to delete image. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="account-sidebar">
      <div className="sidebar-user-info">
        <div className="sidebar-avatar-wrapper" onClick={handleAvatarClick}>
          <img 
            src={avatarSrc} 
            alt="User Avatar" 
            className="sidebar-user-info__avatar" 
          />
          <div className="sidebar-avatar-status"></div>
          <div className="sidebar-avatar-overlay">
            {isUploading ? (
              <div className="sidebar-avatar-spinner"></div>
            ) : (
              <>
                <svg className="sidebar-avatar-camera" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                <span className="sidebar-avatar-text">Change</span>
              </>
            )}
          </div>
          {user.Photo_URL && user.Photo_URL !== "https://res.cloudinary.com/dskodfe9c/image/upload/v1767418134/yjdxjoeazmlrgl5pyko7.png" && (
            <button 
              className="sidebar-avatar-delete"
              onClick={handleDeleteAvatar}
              disabled={isUploading}
              title="Remove profile picture"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div className="sidebar-user-details">
          <p className="sidebar-user-info__name">{user.name}</p>
          <p className="sidebar-user-info__email">{user.email}</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul className="sidebar-nav__list">
          {menuItems.map((item, index) => (
            <li key={index} className={`sidebar-nav__item ${item.active ? 'sidebar-nav__item--active' : ''}`}>
              <a 
                href="#" 
                className="sidebar-nav__link"
                onClick={(e) => {
                  e.preventDefault();
                  if (item.onClick) {
                    item.onClick();
                  }
                }}
              >
                <span className="sidebar-nav__icon">{item.icon}</span>
                <span className="sidebar-nav__text">{item.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
