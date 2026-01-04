import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function BlogList() {
  const [message, setMessage] = useState("");
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/blogs`
        );
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setMessage("Failed to load blogs");
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Blog List</h1>
        <p className="page-subtitle">View and manage all your published blog posts</p>
      </div>

      {message && (
        <div className="alert alert-error">{message}</div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Blogs</h3>
          <span className="badge badge-primary">{blogs.length} posts</span>
        </div>

        {blogs.length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
            </svg>
            <h3>No blogs yet</h3>
            <p>Create your first blog post to get started</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog._id}>
                    <td style={{ fontWeight: 500 }}>{blog.title}</td>
                    <td className="text-muted" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {blog.description || "—"}
                    </td>
                    <td>
                      <span className="badge badge-primary">{blog.category}</span>
                    </td>
                    <td>
                      <code style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {blog.slug}
                      </code>
                    </td>
                    <td className="text-muted">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <Link to={`/blog/edit/${blog.slug}`} className="btn btn-warning btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
                        </svg>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogList;
