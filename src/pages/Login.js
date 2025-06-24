import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginMessage, setLoginMessage] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!email.includes("@")) newErrors.email = "Invalid email format.";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix validation errors.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASEURL}/users/login`, {
        email,
        password,
      });

      const token = res.data.data.token;
      if (!token) throw new Error("Token not found in response");

      setToken(token);
      localStorage.setItem("token", token);

      setLoginMessage("Login successful");
      toast.success("Login successful. Redirecting...");

      setTimeout(() => {
        navigate("/blogs");
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || error.message || "Login failed";

      toast.error(message);
      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-violet-700">Welcome Back!</h1>
          <p className="text-gray-600 mt-2">Log in to manage your blog posts.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                errors.form ? "border-red-500 focus:ring-red-400" : "focus:ring-violet-500"
              }`}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                errors.form ? "border-red-500 focus:ring-red-400" : "focus:ring-violet-500"
              }`}
            />
          </div>

          {errors.form && <p className="text-red-500 text-sm mt-1 text-center">{errors.form}</p>}
          {loginMessage && <p className="text-green-500 text-sm mt-1 text-center">{loginMessage}</p>}

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded font-semibold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="flex items-center gap-2">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a href="/register" className="text-violet-600 hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
