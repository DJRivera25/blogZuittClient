import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BlogCard from "../components/BlogCard";
import AddBlogModal from "../components/AddBlogModal";
import UserContext from "../context/UserContext";

const Blog = () => {
  const { user } = useContext(UserContext);
  const [blogs, setBlogs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
  });

  const token = localStorage.getItem("token");

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/blogs`);
      const response = res.data;
      setBlogs(response.data);
    } catch (error) {
      console.error(error.message);
      toast.error("No blogs found. Try adding one!");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [showAddModal]);

  const handleAddBlog = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:4000/blogs`, newBlog, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Blog added successfully!");
      setShowAddModal(false);
      setNewBlog({ title: "", content: "" });
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to add blog");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-violet-700">Blog Posts</h1>

          {/* Show Add button for logged-in users */}
          {user && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2 rounded shadow transition"
            >
              + Add Blog
            </button>
          )}
        </div>

        <BlogCard blogs={blogs} fetchBlogs={fetchBlogs} />
      </div>

      {user && (
        <AddBlogModal
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          newBlog={newBlog}
          setNewBlog={setNewBlog}
          handleAddBlog={handleAddBlog}
        />
      )}
    </div>
  );
};

export default Blog;
