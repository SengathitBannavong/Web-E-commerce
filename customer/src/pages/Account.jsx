import { useEffect, useState } from "react";
import { FaBox, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AccountSidebar } from "../components/AccountSidebar";
import OrderList from "../components/OrderList";
import { ProfileForm } from "../components/ProfileForm";
import { useAuth } from "../contexts/AuthContext";
import { changePassword, updateProfile } from "../services/userService";
import "./Account.css";

const Account = () => {
  const { user, logout, refreshUser } = useAuth(); 
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    gender: "",
    address: "",
    birthDay: "",
    birthMonth: "",
    birthYear: ""
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  // Initialize activeTab from URL query parameter
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      const normalizedTab = tabFromUrl.toLowerCase();
      if (normalizedTab === 'orders' || normalizedTab === 'profile') {
        setActiveTab(normalizedTab);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || user.Name || "",
        phone: user.phone || user.PhoneNumber || "",
        gender: user.gender || user.Gender || "Other",
        address: user.address || user.Address || "",
        birthDay: "", 
        birthMonth: "",
        birthYear: ""
      });
    }
  }, [user]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const menuItems = [
    { 
      icon: <FaUser />, 
      text: "Profile", 
      active: activeTab === 'profile',
      onClick: () => handleTabChange('profile')
    },
    { 
      icon: <FaBox />, 
      text: "My Orders",
      active: activeTab === 'orders',
      onClick: () => handleTabChange('orders')
    }, 
    { 
      icon: <FaSignOutAlt />, 
      text: "Logout", 
      onClick: logout 
    }, 
  ];

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setMessage({ type: "", text: "" });
    
    try {
      // Validate password fields if any are filled
      const isPasswordChange = passwordData.oldPassword || passwordData.newPassword || passwordData.confirmPassword;
      
      if (isPasswordChange) {
        if (!passwordData.oldPassword) {
          setMessage({ type: "error", text: "Please enter your current password" });
          return;
        }
        if (!passwordData.newPassword) {
          setMessage({ type: "error", text: "Please enter a new password" });
          return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          setMessage({ type: "error", text: "New passwords do not match" });
          return;
        }
        if (passwordData.newPassword.length < 6) {
          setMessage({ type: "error", text: "Password must be at least 6 characters" });
          return;
        }
      }

      // Update profile
      await updateProfile(formData);
      
      // Change password if provided
      if (isPasswordChange) {
        await changePassword(passwordData.oldPassword, passwordData.newPassword);
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
      
      setMessage({ type: "success", text: isPasswordChange ? "Profile and password updated successfully!" : "Profile updated successfully!" });
      setIsEditing(false);
      
      if (refreshUser) await refreshUser();
      
    } catch (error) {
      setMessage({ type: "error", text: error.message || "An error occurred." });
    }
  };

  const renderContent = () => {
      switch (activeTab) {
          case 'orders':
              return (
                  <div className="card">
                      <div className="card__header">
                          <h2 className="card__title">My Orders</h2>
                      </div>
                      <div className="card__body">
                          <OrderList />
                      </div>
                  </div>
              );
          case 'profile':
          default:
              return (
                  <div className="card">
                    <div className="card__header">
                      <h2 className="card__title">Basic Information</h2>
                      <div className="content-header__actions" style={{ marginLeft: 'auto' }}> 
                         {isEditing ? (
                            <>
                              <button className="button button--secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                              <button className="button button--primary" onClick={handleSaveProfile}>Save</button>
                            </>
                          ) : (
                            <button className="button button--primary" onClick={() => setIsEditing(true)}>Edit</button>
                          )}
                      </div>
                    </div>
                    <div className="card__body">
                      {message.text && (
                        <div className={`account-alert account-alert--${message.type === 'error' ? 'danger' : 'success'}`} style={{ marginBottom: '1rem'}}>
                          {message.text}
                        </div>
                      )}
                      
                      <ProfileForm
                        user={user} 
                        formData={formData}
                        onFieldChange={handleFieldChange}
                        isEditing={isEditing}
                        passwordData={passwordData}
                        onPasswordChange={handlePasswordChange}
                      />
                    </div>
                  </div>
              );
      }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="account-page">
      <AccountSidebar user={user} menuItems={menuItems} />
      <div className="account-content">
        <div className="content-section">
          <div className="content-header">
            <div>
              <h1 className="content-header__title">
                  {activeTab === 'profile' ? 'Profile' : 
                   activeTab === 'orders' ? 'Orders' : 'Address Book'}
              </h1>
              <p className="content-header__subtitle">
                  {activeTab === 'profile' ? 'Manage your personal information' : 
                   activeTab === 'orders' ? 'Review your purchase history' : 'Set up your shipping address'}
              </p>
            </div>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Account;
