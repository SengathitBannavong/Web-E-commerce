import "./Login.css";
import Header from "../components/header";
import Footer from "../components/footer";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("login", { email, password });
  };

  return (
    <>
      <Header />
      <div className="page login-page">
        <div className="container">
          <div className="login-form-container">
            <h2>Login to Your Account</h2>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn">
                Login
              </button>
            </form>
            <p className="signup-link">
              Don't have an account? <Link to="/">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
