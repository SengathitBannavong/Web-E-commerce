import React, { useState, useEffect } from "react";
import "./Account.css";
import { FaUser, FaBox, FaMapMarkerAlt, FaSignOutAlt } from "react-icons/fa"; 
import { AccountSidebar } from "../components/AccountSidebar";
import { ProfileForm } from "../components/ProfileForm";
import { useAuth } from "../contexts/AuthContext";
import { updateProfile } from "../services/userService";

const Account = () => {
  const { user, logout } = useAuth(); 
  const [isEditing, setIsEditing] = useState(false);
  
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
        fullName: user.name || "",
        phone: user.phone || "",
        gender: user.gender || "Khác",
        address: user.address || "",
        birthDay: "", 
        birthMonth: "",
        birthYear: ""
      });
    }
  }, [user]);

  const menuItems = [
    { icon: <FaUser />, text: "Hồ Sơ Cá Nhân", active: true },
    { icon: <FaBox />, text: "Đơn Hàng Của Tôi" }, 
    { icon: <FaMapMarkerAlt />, text: "Sổ Địa Chỉ" },
    { icon: <FaSignOutAlt />, text: "Đăng Xuất", onClick: logout }, 
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
      
      window.location.reload(); 
      
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Có lỗi xảy ra." });
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
              <h1 className="content-header__title">Hồ Sơ Cá Nhân</h1>
              <p className="content-header__subtitle">Quản lý thông tin cá nhân</p>
            </div>
            <div className="content-header__actions">
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

          {message.text && (
            <div className={`account-alert account-alert--${message.type === 'error' ? 'danger' : 'success'}`}>
              {message.text}
            </div>
          )}

          <div className="card">
            <div className="card__header">
              <h2 className="card__title">Thông Tin Cơ Bản</h2>
            </div>
            <div className="card__body">
              <ProfileForm
                user={user} 
                formData={formData}
                onFieldChange={handleFieldChange}
                isEditing={isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;