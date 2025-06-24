import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, Trash2 } from "lucide-react";
import UpdateBlogModal from "./UpdateBlogModal"; // Make sure this exists
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import UserContext from "../context/UserContext";

const BlogCard = ({ blogs, fetchBlogs }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [currentBlog, setCurrentBlog] = useState({
    title: "",
    content: "",
    id: "",
  });

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const token = localStorage.getItem("token");

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${process.env.REACT_APP_API_BASEURL}/blogs/${currentBlog.id}`, currentBlog, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Blog updated successfully!");
      setShowUpdateModal(false);
      fetchBlogs();
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to update blog.");
    }
  };

  const handleDeleteBlog = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the blog.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_BASEURL}/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Blog deleted successfully!");
        fetchBlogs();
      } catch (error) {
        console.error(error.message);
        toast.error("Failed to delete blog.");
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.isArray(blogs) &&
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="relative bg-white rounded-2xl shadow-md p-6 space-y-4 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Admin-only and Blog Owner Controls */}

              {(user?.isAdmin || blog.author?._id === user?.id) && (
                <div className="absolute top-3 right-3 flex gap-2">
                  {blog.author?._id === user?.id && (
                    <button
                      onClick={() => {
                        setShowUpdateModal(true);
                        setCurrentBlog({
                          title: blog.title,
                          content: blog.content,
                          id: blog._id,
                        });
                      }}
                      className="text-gray-400 hover:text-violet-600 transition"
                      title="Edit"
                    >
                      <Edit3 size={18} />
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteBlog(blog._id)}
                    className="text-gray-400 hover:text-red-500 transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}

              {/* Blog Content */}
              <div>
                <h2 className="text-xl font-bold text-violet-700">{blog.title}</h2>
                <p className="text-sm text-gray-700 line-clamp-4">{blog.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {blog.author?.fullName && `✍️ ${blog.author.fullName}`} • Added on: {formatDate(blog.createdAt)}
                </p>
              </div>

              {/* View Button (everyone) */}
              <button
                onClick={() => navigate(`/blogs/${blog._id}`)}
                className="w-full px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition"
              >
                Read More
              </button>
              {/* Update Modal */}
              {blog.author?._id === user?.id && (
                <UpdateBlogModal
                  showUpdateModal={showUpdateModal}
                  setShowUpdateModal={setShowUpdateModal}
                  currentBlog={currentBlog}
                  setCurrentBlog={setCurrentBlog}
                  handleUpdateBlog={handleUpdateBlog}
                />
              )}
            </div>
          ))}
      </div>
    </>
  );
};

export default BlogCard;
