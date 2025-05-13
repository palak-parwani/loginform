import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginForm2.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginForm2 = () => {
  // State to manage the current form view
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [flipTrigger, setFlipTrigger] = useState(false);

  // Input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Helper: Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Helper: Validate password strength
  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  // Handle form flipping (login <-> register)
  const toggleForm = () => {
    setFlipTrigger(true);
    setTimeout(() => {
      
      setIsRegistering(!isRegistering);
      setIsResetting(false);
      setFlipTrigger(false);
    }, 500);
  };

  // Handle password reset view toggle
  const toggleReset = () => {
    setFlipTrigger(true);
    setTimeout(() => {
      setIsResetting(!isResetting);
      setIsRegistering(false);
      setFlipTrigger(false);
    }, 500);
  };

  // LOGIN handler
  const handleLogin = async () => {
    if (!email || !password) {
      return toast.error("Please enter both email and password.");
    }

    if (!isValidEmail(email)) {
      return toast.error("Please enter a valid email address.");
    }

    try {
      const res = await fetch(`http://localhost:3001/users?email=${email}`);
      const users = await res.json();

      if (users.length === 0) {
        return toast.error("No user found with this email.");
      }

      const user = users[0];
      if (user.password !== password) {
        return toast.error("Incorrect password.");
      }

      toast.success("Login successful!");
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Please try again.");
    }
  };

  // REGISTER handler
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      return toast.error("Please fill in all fields.");
    }

    if (!isValidEmail(email)) {
      return toast.error("Please enter a valid email address.");
    }

    if (!isValidPassword(password)) {
      return toast.error("Password must be at least 6 characters.");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      const res = await fetch(`http://localhost:3001/users?email=${email}`);
      const users = await res.json();

      if (users.length > 0) {
        return toast.error("Email already registered.");
      }

      const newUser = { email, password };

      await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      toast.success("Registration successful! You can now login.");
      setIsRegistering(false);
    } catch (err) {
      console.error(err);
      toast.error("Registration failed. Please try again.");
    }
  };

  // PASSWORD RESET handler
  const handleResetPassword = async () => {
    if (!email) {
      return toast.error("Please enter your email.");
    }

    if (!isValidEmail(email)) {
      return toast.error("Please enter a valid email address.");
    }

    if (!password || !confirmPassword) {
      return toast.error("Please enter both password fields.");
    }

    if (!isValidPassword(password)) {
      return toast.error("Password must be at least 6 characters.");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      const res = await fetch(`http://localhost:3001/users?email=${email}`);
      const users = await res.json();

      if (users.length === 0) {
        return toast.error("Email not found.");
      }

      const user = users[0];

      await fetch(`http://localhost:3001/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      toast.success("Password reset successfully.");
      setIsResetting(false);
    } catch (err) {
      console.error(err);
      toast.error("Password reset failed. Try again.");
    }
  };

  // Unified SUBMIT handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegistering) {
      await handleRegister();
    } else if (isResetting) {
      await handleResetPassword();
    } else {
      await handleLogin();
    }

    // Clear sensitive fields after use
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div
      className="auth-wrapper"
      style={{
        backgroundImage: `url('https://user-images.githubusercontent.com/13468728/233847739-219cb494-c265-4554-820a-bd3424c59065.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className={`auth-box glass-box ${flipTrigger ? "flipped" : ""}`}>
        <h2 className="text-center mb-4 text-white fw-bold">
          {isResetting
            ? "Reset Password"
            : isRegistering
            ? "Register"
            : "Login"}
        </h2>

        {/* AUTH FORM */}
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

          {/* Password Field - hidden during reset confirm */}
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

          {/* Confirm Password Field for Register */}
          {isRegistering && (
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

          {/* Reset Password Fields */}
          {isResetting && (
            <>
              <div className="mb-4 d-flex align-items-center bg-input">
                <FaLock className="me-2 text-white" />
                <input
                  type="password"
                  className="form-control bg-transparent border-0 text-white"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-4 d-flex align-items-center bg-input">
                <FaLock className="me-2 text-white" />
                <input
                  type="password"
                  className="form-control bg-transparent border-0 text-white"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Remember Me & Forgot Password (login only) */}
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
              <div className="forgetPass">
                <span
                  className="ms-2 text-white small"
                  role="button"
                  onClick={toggleReset}
                >
                  Forgot Password
                </span>
              </div>
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

          {/* Form Toggle Text */}
          <p className="text-center text-white text-decoration-none mb-1">
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
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-center" autoClose={3000} theme="dark" />
    </div>
  );
};

export default LoginForm2;
