import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginForm2.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginForm2 = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setIsResetting(false);
  };

  const toggleReset = () => {
    setIsResetting(!isResetting);
    setIsRegistering(false);
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) => password.length >= 6;

  const handleLogin = async () => {
    if (!email || !password) return toast.error("Enter email and password.");
    if (!isValidEmail(email)) return toast.error("Invalid email format.");

    try {
      const res = await fetch(`http://localhost:3001/users?email=${email}`);
      const users = await res.json();
      if (users.length === 0) return toast.error("User not found.");
      if (users[0].password !== password) return toast.error("Wrong password.");

      toast.success("Login successful!");
    } catch (err) {
      console.error(err);
      toast.error("Login failed.");
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword)
      return toast.error("Fill all fields.");
    if (!isValidEmail(email)) return toast.error("Invalid email.");
    if (!isValidPassword(password))
      return toast.error("Password must be at least 6 characters.");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match.");

    try {
      const res = await fetch(`http://localhost:3001/users?email=${email}`);
      const users = await res.json();
      if (users.length > 0) return toast.error("Email already registered.");

      await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      toast.success("Registered successfully!");
      setIsRegistering(false);
    } catch (err) {
      console.error(err);
      toast.error("Registration failed.");
    }
  };

  const handleResetPassword = async () => {
    if (!email) return toast.error("Enter your email.");
    if (!isValidEmail(email)) return toast.error("Invalid email.");
    if (!password || !confirmPassword)
      return toast.error("Enter new password twice.");
    if (!isValidPassword(password))
      return toast.error("Password must be at least 6 characters.");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match.");

    try {
      const res = await fetch(`http://localhost:3001/users?email=${email}`);
      const users = await res.json();
      if (users.length === 0) return toast.error("Email not found.");

      const user = users[0];
      await fetch(`http://localhost:3001/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      toast.success("Password reset successful.");
      setIsResetting(false);
    } catch (err) {
      console.error(err);
      toast.error("Password reset failed.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const email = decoded.email;

      const res = await fetch(`http://localhost:3001/users?email=${email}`);
      const users = await res.json();

      if (users.length === 0) {
        // New user - register
        await fetch("http://localhost:3001/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: "" }),
        });
        toast.success("Google sign-up successful!");
      } else {
        // Existing user - login
        toast.success("Google login successful!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Google login failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      await handleRegister();
    } else if (isResetting) {
      await handleResetPassword();
    } else {
      await handleLogin();
    }
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div
      className="auth-wrapper"
      style={{
        backgroundImage: `url('https://user-images.githubusercontent.com/13468728/233847739-219cb494-c265-4554-820a-bd3424c59065.jpg')`,
        backgroundSize: "cover",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="auth-box glass-box">
        <h2 className="text-center mb-4 text-white fw-bold">
          {isResetting
            ? "Reset Password"
            : isRegistering
            ? "Register"
            : "Login"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4 d-flex align-items-center bg-input">
            <FaEnvelope className="me-2 text-white" />
            <input
              type="email"
              className="form-control bg-transparent border-0 text-white"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          {!isResetting && (
            <div className="mb-4 d-flex align-items-center bg-input">
              <FaLock className="me-2 text-white" />
              <input
                type="password"
                className="form-control bg-transparent border-0 text-white"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {/* Confirm Password for Register/Reset */}
          {(isRegistering || isResetting) && (
            <div className="mb-4 d-flex align-items-center bg-input">
              <FaLock className="me-2 text-white" />
              <input
                type="password"
                className="form-control bg-transparent border-0 text-white"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          {/* Google Sign-in */}
          {!isResetting && (
            <div className="mb-4 text-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Sign In Failed")}
                theme="outline"
                shape="rectangular"
                text={isRegistering ? "signup_with" : "signin_with"}
                size="large"
                useOneTap={false}
              />
            </div>
          )}

          {/* Remember/Forgot (login only) */}
          {!isRegistering && !isResetting && (
            <div className="mb-4 form-check text-start d-flex flex-row justify-content-between">
              <div>
                <input
                  type="checkbox"
                  className="form-check-input bg-transparent"
                  id="rememberMe"
                />
                <label
                  className="form-check-label text-white"
                  htmlFor="rememberMe"
                >
                  Remember Me
                </label>
              </div>
              <span
                className="ms-2 text-white small"
                role="button"
                onClick={toggleReset}
              >
                Forgot Password?
              </span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-light w-100 mb-3 rounded-pill"
          >
            {isResetting
              ? "Reset Password"
              : isRegistering
              ? "Register"
              : "Log In"}
          </button>

          {/* Toggle Form */}
          <p className="text-center text-white">
            {isResetting ? (
              <>
                Back to{" "}
                <span
                  role="button"
                  className="text-light fw-bold"
                  onClick={toggleReset}
                >
                  Login
                </span>
              </>
            ) : (
              <>
                {isRegistering
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <span
                  role="button"
                  className="text-light fw-bold"
                  onClick={toggleForm}
                >
                  {isRegistering ? "Login" : "Register"}
                </span>
              </>
            )}
          </p>
        </form>
        <ToastContainer position="top-center" autoClose={3000} theme="dark" />
      </div>
    </div>
  );
};

export default LoginForm2;
