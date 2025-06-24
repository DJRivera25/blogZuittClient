import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
    email: "",
  });

  const unsetUser = () => {
    setUser({
      id: null,
      isAdmin: null,
      email: "",
    });
    setToken(null);
    localStorage.clear();
  };

  const fetchUser = async () => {
    if (!token) return unsetUser();

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASEURL}/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser({
        id: res.data.data._id,
        isAdmin: res.data.data.isAdmin,
        email: res.data.data.email,
      });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      unsetUser();
    }
  };

  useEffect(() => {
    console.log("UserContext token:", token);
    if (token && token !== "null") {
      localStorage.setItem("token", token);
      fetchUser();
    }
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        unsetUser,
        token,
        setToken,
        fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
