import React, { useMemo } from 'react';
import './ProfileForm.css';

export const ProfileForm = ({ user, formData, onFieldChange, isEditing }) => {
  const { birthDate = {} } = user ?? {};

  const { days, months, years } = useMemo(() => {
    const dayOptions = Array.from({ length: 31 }, (_, index) => (index + 1).toString());
    const monthOptions = Array.from({ length: 12 }, (_, index) => (index + 1).toString());
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 80 }, (_, index) => (currentYear - index).toString());
    return { days: dayOptions, months: monthOptions, years: yearOptions };
  }, []);

  const selectedDay = formData?.birthDay ?? (birthDate.day ? birthDate.day.toString() : "");
  const selectedMonth = formData?.birthMonth ?? (birthDate.month ? birthDate.month.toString() : "");
  const selectedYear = formData?.birthYear ?? (birthDate.year ? birthDate.year.toString() : "");

  const genderOptions = ["Nam", "Nữ", "Khác"];

  return (
    <form className="form-grid">
      <div className="form-group">
        <label htmlFor="fullName" className="form-label">Họ và Tên <span className="form-label--required">*</span></label>
        <input
          type="text"
          id="fullName"
          className="form-input"
          value={formData?.fullName ?? user?.name ?? ""}
          onChange={(event) => onFieldChange('fullName', event.target.value)}
          readOnly={!isEditing}
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone" className="form-label">Số Điện Thoại <span className="form-label--required">*</span></label>
        <input
          type="text"
          id="phone"
          className="form-input"
          value={formData?.phone ?? user?.phone ?? ""}
          onChange={(event) => onFieldChange('phone', event.target.value)}
          readOnly={!isEditing}
        />
      </div>
      <div className="form-group form-group--full">
        <label htmlFor="email" className="form-label">Email <span className="form-label--required">*</span></label>
        <div className="form-input-wrapper">
          <input type="email" id="email" className="form-input" value={user?.email ?? ""} readOnly />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Ngày Sinh</label>
        <div className="form-date-select">
          <select
            className="form-select"
            value={selectedDay}
            onChange={(event) => onFieldChange('birthDay', event.target.value)}
            disabled={!isEditing}
          >
            <option value="" disabled>Ngày</option>
            {days.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <select
            className="form-select"
            value={selectedMonth}
            onChange={(event) => onFieldChange('birthMonth', event.target.value)}
            disabled={!isEditing}
          >
            <option value="" disabled>Tháng</option>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <select
            className="form-select"
            value={selectedYear}
            onChange={(event) => onFieldChange('birthYear', event.target.value)}
            disabled={!isEditing}
          >
            <option value="" disabled>Năm</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
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
                checked={(formData?.gender ?? user?.gender) === option}
                onChange={(event) => onFieldChange('gender', event.target.value)}
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
