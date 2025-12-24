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