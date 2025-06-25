import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // hamburger icons
import UserContext from "../context/UserContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, unsetUser } = useContext(UserContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    unsetUser();
    setMobileOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Blogs", path: "/blogs" },
    { name: "Profile", path: "/profile" },
  ];

  const toggleMenu = () => setMobileOpen(!mobileOpen);
  const closeMenu = () => setMobileOpen(false);

  return (
    <header className="fixed w-full z-50 bg-white/70 backdrop-blur border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1
          onClick={() => {
            navigate("/");
            closeMenu();
          }}
          className="text-violet-700 text-2xl font-extrabold tracking-wide cursor-pointer"
        >
          Blog.io
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={closeMenu}
              className="relative group font-medium hover:text-violet-600 transition"
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 h-[2px] bg-violet-500 w-0 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
          {token ? (
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 bg-red-500 text-white font-semibold rounded shadow hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                closeMenu();
              }}
              className="px-4 py-1.5 bg-violet-600 text-white font-semibold rounded shadow hover:bg-violet-700 transition"
            >
              Login
            </button>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle Menu">
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-inner px-6 py-4 space-y-4 transition-all duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={closeMenu}
              className="block text-gray-700 font-medium hover:text-violet-600"
            >
              {link.name}
            </Link>
          ))}
          {token ? (
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                closeMenu();
              }}
              className="w-full px-4 py-2 bg-violet-600 text-white font-semibold rounded hover:bg-violet-700 transition"
            >
              Login
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
