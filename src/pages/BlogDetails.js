import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, MessageCircle, Trash2, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import UserContext from "../context/UserContext";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(UserContext);

  const [blog, setBlog] = useState(null);
  const [blogComments, setBlogComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASEURL}/blogs/${id}`);
      setBlog(res.data.data);
    } catch (err) {
      console.error("Failed to fetch blog:", err.message);
      setError("Failed to load blog details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogComments = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASEURL}/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogComments(res.data.data);
    } catch (err) {
      console.error("Failed to fetch blog comments:", err.message);
      setError("Failed to load blog comments. Login First");
    }
  };

  useEffect(() => {
    fetchBlog();
    fetchBlogComments();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return toast.error("Comment cannot be empty.");
    try {
      setCommentLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API_BASEURL}/comments/${id}`,
        { comment: commentInput },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Comment added!");
      setCommentInput("");
      fetchBlogComments();
    } catch (error) {
      toast.error("Failed to post comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: "Delete this comment?",
      text: "You won't be able to undo this action.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280", // gray-500
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_BASEURL}/comments/delete/${commentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Comment deleted.");
        fetchBlogComments();
      } catch (error) {
        toast.error("Failed to delete comment.");
      }
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editInput.trim()) return toast.error("Comment cannot be empty.");
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_BASEURL}/comments/update/${commentId}`,
        { comment: editInput },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Comment updated!");
      setEditingCommentId(null);
      setEditInput("");
      fetchBlogComments();
    } catch (error) {
      toast.error("Failed to update comment.");
    }
  };

  const handleBlogEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Title and content cannot be empty.");
      return;
    }

    try {
      await axios.patch(
        `${process.env.REACT_APP_API_BASEURL}/blogs/${id}`,
        { title: editTitle, content: editContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Blog updated!");
      setIsEditingBlog(false);
      fetchBlog();
    } catch (err) {
      toast.error("Failed to update blog.");
    }
  };

  const handleDeleteBlog = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the blog.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280", // gray-500
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_BASEURL}/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Blog deleted.");
        navigate(-1);
      } catch (err) {
        toast.error("Failed to delete blog.");
      }
    }
  };

  const canDelete = (commentUserId) => {
    if (!user || !commentUserId) return false;
    return user.isAdmin || blog?.author?._id === user.id || commentUserId._id === user.id;
  };

  const canEdit = (commentUserId) => {
    if (!user || !commentUserId) return false;
    return commentUserId._id === user.id;
  };

  if (loading || !blog) {
    return <div className="text-center py-20 text-violet-600 text-xl font-semibold">Loading blog post...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500 text-lg font-semibold">{error}</div>;
  }

  const isBlogOwner = blog?.author?._id === user?.id;

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-violet-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Blog Content or Edit Form */}
        {isEditingBlog ? (
          <>
            <input
              type="text"
              className="w-full p-2 border rounded mb-2"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <textarea
              className="w-full p-4 border rounded mb-2"
              rows={6}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="flex gap-2 mb-4">
              <button onClick={handleBlogEdit} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Save
              </button>
              <button
                onClick={() => setIsEditingBlog(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-violet-700">{blog.title}</h1>
                <div className="text-gray-700 whitespace-pre-line mt-2">{blog.content}</div>
              </div>

              {(isBlogOwner || user?.isAdmin) && (
                <div className="flex gap-2">
                  {isBlogOwner && (
                    <button
                      onClick={() => {
                        setIsEditingBlog(true);
                        setEditTitle(blog.title);
                        setEditContent(blog.content);
                      }}
                      className="text-gray-500 hover:text-blue-600 transition"
                      title="Edit Blog"
                    >
                      <Pencil size={20} />
                    </button>
                  )}
                  <button
                    onClick={handleDeleteBlog}
                    className="text-gray-500 hover:text-red-600 transition"
                    title="Delete Blog"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Author Info */}
        <p className="text-sm text-gray-400 mt-4">
          Author: {blog.author?.fullName || "Unknown"} • Created: {new Date(blog.createdAt).toLocaleString()}{" "}
          {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
            <>• Updated: {new Date(blog.updatedAt).toLocaleString()}</>
          )}
        </p>

        {/* Comments */}
        <div className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-violet-700 mb-4">
            <MessageCircle size={20} />
            Comments
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="mb-6">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              rows="3"
              placeholder="Write a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={commentLoading}
              className="mt-2 px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition"
            >
              {commentLoading ? "Posting..." : "Post Comment"}
            </button>
          </form>

          {/* Comments List */}
          {Array.isArray(blogComments) && blogComments.length > 0 ? (
            <ul className="space-y-4">
              {blogComments.map((c) => (
                <li key={c._id} className="border rounded-lg p-4 bg-gray-50 shadow-sm relative">
                  {editingCommentId === c._id ? (
                    <>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                        value={editInput}
                        onChange={(e) => setEditInput(e.target.value)}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleEditComment(c._id)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-700">💬 {c.comment}</p>
                      <div className="text-sm text-gray-500 mt-2">
                        👤 {c.userId?.fullName || "Anonymous"} • {new Date(c.createdAt).toLocaleString()}
                      </div>
                      {(canEdit(c.userId) || canDelete(c.userId)) && (
                        <div className="absolute top-2 right-2 flex gap-2">
                          {canEdit(c.userId) && (
                            <button
                              onClick={() => {
                                setEditingCommentId(c._id);
                                setEditInput(c.comment);
                              }}
                              className="text-gray-400 hover:text-blue-500 transition"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                          {canDelete(c.userId) && (
                            <button
                              onClick={() => handleDeleteComment(c._id)}
                              className="text-gray-400 hover:text-red-500 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
