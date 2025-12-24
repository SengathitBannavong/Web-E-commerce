import React from 'react';
import './ProfileForm.css';

export const ProfileForm = ({ formData, onFieldChange, isEditing }) => {
  const genderOptions = ["Nam", "Nữ", "Khác"];

  return (
    <form className="form-grid">
      <div className="form-group">
        <label className="form-label">Họ và Tên</label>
        <input
          type="text"
          className="form-input"
          value={formData.fullName}
          onChange={(e) => onFieldChange('fullName', e.target.value)}
          readOnly={!isEditing}
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Số Điện Thoại</label>
        <input
          type="text"
          className="form-input"
          value={formData.phone}
          onChange={(e) => onFieldChange('phone', e.target.value)}
          readOnly={!isEditing}
        />
      </div>

      <div className="form-group form-group--full">
        <label className="form-label">Địa Chỉ</label>
        <input
          type="text"
          className="form-input"
          value={formData.address}
          onChange={(e) => onFieldChange('address', e.target.value)}
          readOnly={!isEditing}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Giới Tính</label>
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
    </form>
  );
};