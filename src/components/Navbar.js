import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserContext from "../context/UserContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, unsetUser } = useContext(UserContext);

  const handleLogout = () => {
    unsetUser();
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Blogs", path: "/blogs" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <header className="fixed w-full backdrop-blur border-b z-50 px-6 py-4 shadow-sm bg-white/70">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-violet-700 text-2xl font-extrabold tracking-wide cursor-pointer"
        >
          Blog.io
        </h1>

        {/* Navigation Links */}
        <nav className="space-x-6 hidden md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="relative group font-medium hover:text-violet-600 transition"
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 h-[2px] bg-violet-400 w-0 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* Auth Button */}
        {token ? (
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 bg-red-500 text-white font-semibold rounded shadow hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-1.5 bg-violet-600 text-white font-semibold rounded shadow hover:bg-violet-700 transition"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
