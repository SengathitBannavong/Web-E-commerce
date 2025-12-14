import "./Register.css";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { useState } from "react";
import apiFetch from "../services/api"; // Import apiFetch

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    gender: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const onSubmit = async (e) => {
    // Made onSubmit async
    e.preventDefault();
    const validationErrors = {};
    setServerError("");

    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      validationErrors.email = "Please enter a valid email address.";
    }

    if (!form.password || form.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters.";
    }

    if (form.password !== form.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // Send all required fields to the backend for registration
      const response = await apiFetch("/users/register", {
        method: "POST",
        body: JSON.stringify({
          Name: form.name,
          Email: form.email,
          Password: form.password,
          PhoneNumber: form.phone,
          Address: form.address,
          Gender: form.gender,
        }),
      });
      console.log("Registration successful:", response);
      localStorage.setItem("token", response.token); // Store token (TODO: Move to a dedicated context/service)
      navigate("/"); // Redirect to home page (TODO: Make dynamic or user's last page)
    } catch (error) {
      console.error("Registration failed:", error.message);
      setServerError(error.message || "Registration failed. Please try again."); // Display error to user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page register-page">
      <div className="container">
        <div className="register-form-container">
          <h2>Create an Account</h2>
          <form onSubmit={onSubmit} className="register-form" noValidate>
            <div className="form-group">
              <label htmlFor="name"></label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email"></label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="Enter your email"
                required
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password"></label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="Enter a strong password"
                required
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword"></label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={onChange}
                placeholder="Re-enter your password"
                required
                className={errors.confirmPassword ? "input-error" : ""}
              />
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone"></label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address"></label>
              <input
                type="text"
                id="address"
                name="address"
                value={form.address}
                onChange={onChange}
                placeholder="Enter your address"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender"></label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={onChange}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {serverError && (
              <p
                className="error-message"
                style={{ color: "red", marginBottom: "1rem" }}
              >
                {serverError}
              </p>
            )}
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="signin-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
