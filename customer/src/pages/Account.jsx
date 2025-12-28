import React, { useState, useEffect } from "react";
import "./Account.css";
import { FaUser, FaBox, FaSignOutAlt } from "react-icons/fa"; 
import { AccountSidebar } from "../components/AccountSidebar";
import { ProfileForm } from "../components/ProfileForm";
import OrderList from "../components/OrderList";
import { useAuth } from "../contexts/AuthContext";
import { updateProfile } from "../services/userService";

const Account = () => {
  const { user, logout, refreshUser } = useAuth(); 
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

  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || user.Name || "",
        phone: user.phone || user.PhoneNumber || "",
        gender: user.gender || user.Gender || "Khác",
        address: user.address || user.Address || "",
        birthDay: "", 
        birthMonth: "",
        birthYear: ""
      });
    }
  }, [user]);

  const menuItems = [
    { 
      icon: <FaUser />, 
      text: "Hồ Sơ Cá Nhân", 
      active: activeTab === 'profile',
      onClick: () => setActiveTab('profile')
    },
    { 
      icon: <FaBox />, 
      text: "Đơn Hàng Của Tôi",
      active: activeTab === 'orders',
      onClick: () => setActiveTab('orders')
    }, 
    { 
      icon: <FaSignOutAlt />, 
      text: "Đăng Xuất", 
      onClick: logout 
    }, 
  ];

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setMessage({ type: "", text: "" });
    try {
      await updateProfile(formData);
      
      setMessage({ type: "success", text: "Cập nhật hồ sơ thành công!" });
      setIsEditing(false);
      
      if (refreshUser) await refreshUser();
      
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Có lỗi xảy ra." });
    }
  };

  const renderContent = () => {
      switch (activeTab) {
          case 'orders':
              return (
                  <div className="card">
                      <div className="card__header">
                          <h2 className="card__title">Đơn Hàng Của Tôi</h2>
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
                      <h2 className="card__title">Thông Tin Cơ Bản</h2>
                      <div className="content-header__actions" style={{ marginLeft: 'auto' }}> 
                         {isEditing ? (
                            <>
                              <button className="button button--secondary" onClick={() => setIsEditing(false)}>Huỷ</button>
                              <button className="button button--primary" onClick={handleSaveProfile}>Lưu</button>
                            </>
                          ) : (
                            <button className="button button--primary" onClick={() => setIsEditing(true)}>Chỉnh Sửa</button>
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
                  {activeTab === 'profile' ? 'Hồ Sơ Cá Nhân' : 
                   activeTab === 'orders' ? 'Đơn Hàng' : 'Sổ Địa Chỉ'}
              </h1>
              <p className="content-header__subtitle">
                  {activeTab === 'profile' ? 'Quản lý thông tin cá nhân' : 
                   activeTab === 'orders' ? 'Xem lại lịch sử mua hàng' : 'Thiết lập địa chỉ giao hàng'}
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
