import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './ProfileForm.css';

export const ProfileForm = ({ formData, onFieldChange, isEditing, passwordData, onPasswordChange }) => {
  const genderOptions = ["Male", "Female", "Other"];
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <form className="form-grid">
      <div className="form-group">
        <label className="form-label">Name:</label>
        <input
          type="text"
          className="form-input"
          value={formData.fullName}
          onChange={(e) => onFieldChange('fullName', e.target.value)}
          readOnly={!isEditing}
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Phone:</label>
        <input
          type="text"
          className="form-input"
          value={formData.phone}
          onChange={(e) => onFieldChange('phone', e.target.value)}
          readOnly={!isEditing}
        />
      </div>

      <div className="form-group form-group--full">
        <label className="form-label">Address:</label>
        <input
          type="text"
          className="form-input"
          value={formData.address}
          onChange={(e) => onFieldChange('address', e.target.value)}
          readOnly={!isEditing}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Gender:</label>
        <div className="form-radio-group">
          {genderOptions.map((option) => (
            <label key={option} className="form-radio-label">
              <input
                type="radio"
                name="gender"
                value={option}
                checked={formData.gender === option}
                onChange={(e) => onFieldChange('gender', e.target.value)}
                disabled={!isEditing}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Password Change Section */}
      {isEditing && passwordData && (
        <>
          <div className="form-group form-group--full password-section-header">
            <h3 className="password-section-title">Change Password</h3>
            <p className="password-section-subtitle">Leave blank if you don't want to change your password</p>
          </div>

          <div className="form-group">
            <label className="form-label">Current Password:</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.old ? "text" : "password"}
                className="form-input"
                value={passwordData.oldPassword}
                onChange={(e) => onPasswordChange('oldPassword', e.target.value)}
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('old')}
              >
                {showPasswords.old ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">New Password:</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.new ? "text" : "password"}
                className="form-input"
                value={passwordData.newPassword}
                onChange={(e) => onPasswordChange('newPassword', e.target.value)}
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password:</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                className="form-input"
                value={passwordData.confirmPassword}
                onChange={(e) => onPasswordChange('confirmPassword', e.target.value)}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </>
      )}
    </form>
  );
};