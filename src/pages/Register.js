import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!email.includes("@")) newErrors.email = "Invalid email.";
    if (!/^09\d{9}$/.test(mobileNo)) newErrors.mobileNo = "Must be a valid PH mobile number.";
    if (password.length < 8) newErrors.password = "Password must be at least 8 characters.";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix validation errors.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`http://localhost:4000/users/register`, {
        fullName,
        email,
        password,
        mobileNo,
      });
      toast.success("Registration successful! Redirecting...");
      setTimeout(() => (window.location.href = "/login"), 2000);
    } catch (error) {
      const msg = error.response?.data?.error || "Registration failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (field) =>
    `w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
      errors[field] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-violet-500"
    }`;

  return (
    <div className="text-black min-h-screen flex items-center justify-center px-4 transition-colors">
      <ToastContainer />
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-violet-700">Create Your Account</h1>
        <p className="text-gray-600">Register to start writing and reading blogs</p>

        <form onSubmit={handleSignup} className="space-y-4" noValidate>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClasses("fullName")}
            required
          />
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}

          <input
            type="text"
            placeholder="Mobile Number (09xxxxxxxxx)"
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            className={inputClasses("mobileNo")}
            required
          />
          {errors.mobileNo && <p className="text-red-500 text-sm">{errors.mobileNo}</p>}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses("email")}
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClasses("password")}
            required
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClasses("confirmPassword")}
            required
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded font-semibold transition disabled:opacity-50"
          >
            {loading ? (
              <span className="loader ease-linear rounded-full border-2 border-t-2 border-white h-5 w-5"></span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="flex items-center gap-2">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-violet-600 hover:underline font-medium">
            Log In
          </a>
        </p>
      </div>

      <style>{`
        .loader {
          border-top-color: transparent;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Register;
