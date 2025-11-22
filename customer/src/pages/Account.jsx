import React, { useState } from "react";
import "./Account.css";
import {
  FaUser,
  FaBox,
  FaHeart,
  FaMapMarkerAlt,
  FaCreditCard,
  FaBell,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { AccountSidebar } from "../components/AccountSidebar";
import { ProfileForm } from "../components/ProfileForm";
import { MOCK_USER as mockUser } from "../data/account";

const createFormState = (user) => ({
  fullName: user?.name ?? "",
  phone: user?.phone ?? "",
  email: user?.email ?? "",
  birthDay: user?.birthDate?.day ? user.birthDate.day.toString() : "",
  birthMonth: user?.birthDate?.month ? user.birthDate.month.toString() : "",
  birthYear: user?.birthDate?.year ? user.birthDate.year.toString() : "",
  gender: user?.gender ?? "",
});

const Account = () => {
  const [userData, setUserData] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(!mockUser.isProfileCompleted);
  const [formState, setFormState] = useState(createFormState(mockUser));

  const menuItems = [
    { icon: <FaUser />, text: "Hồ Sơ Cá Nhân", active: true },
    { icon: <FaBox />, text: "Đơn Hàng Của Tôi" },
    { icon: <FaMapMarkerAlt />, text: "Sổ Địa Chỉ" },
    { icon: <FaCreditCard />, text: "Phương Thức Thanh Toán" },
    { icon: <FaBell />, text: "Thông Báo" },
    { icon: <FaSignOutAlt />, text: "Đăng Xuất" },
  ];

  const handleFieldChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = () => {
    setFormState(createFormState(userData));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormState(createFormState(userData));
    setIsEditing(false);
  };

  const handleSaveProfile = () => {
    const sanitizedName = formState.fullName.trim();
    const sanitizedPhone = formState.phone.trim();

    const updatedUser = {
      ...userData,
      name: sanitizedName,
      phone: sanitizedPhone,
      gender: formState.gender,
      birthDate: {
        day: formState.birthDay ? Number(formState.birthDay) : null,
        month: formState.birthMonth ? Number(formState.birthMonth) : null,
        year: formState.birthYear ? Number(formState.birthYear) : null,
      },
    };

    const hasBasicInfo = Boolean(
      sanitizedName &&
        sanitizedPhone &&
        updatedUser.birthDate.day &&
        updatedUser.birthDate.month &&
        updatedUser.birthDate.year &&
        formState.gender
    );

    updatedUser.isProfileCompleted = hasBasicInfo;
    updatedUser.needsProfileUpdate = false;

    setUserData(updatedUser);
    setIsEditing(false);
  };

  const shouldPromptProfile = !userData.isProfileCompleted;
  const shouldPromptUpdate = userData.needsProfileUpdate;

  return (
    <div className="account-page">
      <AccountSidebar user={userData} menuItems={menuItems} />
      <div className="account-content">
        <div className="content-section">
          <div className="content-header">
            <div>
              <h1 className="content-header__title">Hồ Sơ Cá Nhân</h1>
              <p className="content-header__subtitle">
                Quản lý thông tin cá nhân của bạn
              </p>
            </div>
            <div className="content-header__actions">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={handleCancelEdit}
                  >
                    Huỷ
                  </button>
                  <button
                    type="button"
                    className="button button--primary"
                    onClick={handleSaveProfile}
                  >
                    Lưu
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="button button--primary"
                  onClick={handleEditClick}
                >
                  Chỉnh Sửa
                </button>
              )}
            </div>
          </div>

          {(shouldPromptProfile || shouldPromptUpdate) && (
            <div
              className={`account-alert ${
                shouldPromptProfile
                  ? "account-alert--warning"
                  : "account-alert--info"
              }`}
            >
              {shouldPromptProfile
                ? 'Hồ sơ của bạn chưa hoàn thiện. Nhấn "Chỉnh Sửa" để bổ sung thông tin.'
                : "Đã đến lúc cập nhật hồ sơ của bạn để đảm bảo thông tin luôn chính xác."}
            </div>
          )}

          <div className="card">
            <div className="card__body avatar-section">
              <img
                src={userData.avatar}
                alt="User Avatar"
                className="avatar-section__img"
              />
              <div className="avatar-section__actions">
                <button
                  type="button"
                  className="button button--secondary"
                  disabled={!isEditing}
                >
                  Thay Đổi Ảnh
                </button>
                <button
                  type="button"
                  className="button button--danger-outline"
                  disabled={!isEditing}
                >
                  Xóa Ảnh
                </button>
                <p className="avatar-section__hint">
                  Dung lượng tối đa 2MB. Định dạng: JPG, PNG
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <h2 className="card__title">Thông Tin Cơ Bản</h2>
            </div>
            <div className="card__body">
              <ProfileForm
                user={userData}
                formData={formState}
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
