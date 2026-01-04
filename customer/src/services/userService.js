import apiFetch from "./api";

/**
 * Cập nhật thông tin profile user
 * @param {object} userData - Dữ liệu từ form (camelCase)
 */
export const updateProfile = async (userData) => {
  // Chuyển đổi format camelCase (Frontend) sang PascalCase (Backend)
  const payload = {
    Name: userData.fullName,
    PhoneNumber: userData.phone,
    Gender: userData.gender,
    Address: userData.address, 
  };

  // Gọi PUT /users/me
  return apiFetch("/users/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

/**
 * Upload user profile avatar
 * @param {File} imageFile - The image file to upload
 */
export const uploadProfileImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  return apiFetch("/users/me/upload-profile", {
    method: "POST",
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * Delete user profile avatar
 */
export const deleteProfileImage = async () => {
  return apiFetch("/users/me/delete-profile", {
    method: "POST",
  });
};

/**
 * Change user password
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 */
export const changePassword = async (oldPassword, newPassword) => {
  return apiFetch("/users/change_password", {
    method: "POST",
    body: JSON.stringify({
      oldPassword,
      newPassword
    }),
  });
};