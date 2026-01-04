import React, { useState, useEffect } from "react";
import axios from "axios";

function CreateCetergory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/categories`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setMessage("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/categories`,
        { name, description },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setMessage("Category created successfully!");
      console.log("Category created:", response.data);
      setName("");
      setDescription("");
      const updatedCategories = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/categories`
      );
      setCategories(updatedCategories.data);
    } catch (error) {
      console.error("Error creating category:", error);
      setMessage(
        "Failed to create category: " +
        (error.response?.data?.message || "Unknown error")
      );
    }
  };

  const handleDelete = async (id) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!userConfirmed) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/categories/${id}`
      );
      setMessage("Category deleted successfully!");
      const updatedCategories = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/categories`
      );
      setCategories(updatedCategories.data);
    } catch (error) {
      console.error("Error deleting category:", error);
      setMessage(
        "Failed to delete category: " +
        (error.response?.data?.message || "Unknown error")
      );
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category._id);
    setEditName(category.name);
    setEditDescription(category.description || "");
  };

  const handleSave = async (id) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/categories/${id}`,
        { name: editName, description: editDescription },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setMessage("Category updated successfully!");
      console.log("Category updated:", response.data);
      setEditingCategory(null);
      const updatedCategories = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/categories`
      );
      setCategories(updatedCategories.data);
    } catch (error) {
      console.error("Error updating category:", error);
      setMessage(
        "Failed to update category: " +
        (error.response?.data?.message || "Unknown error")
      );
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setEditName("");
    setEditDescription("");
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        <p className="page-subtitle">Manage your blog categories</p>
      </div>

      {message && (
        <div className={`alert ${message.includes("success") ? "alert-success" : "alert-error"}`}>
          {message}
        </div>
      )}

      {/* Category Creation Form */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Create New Category</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="categoryName" className="form-label">
                Category Name
              </label>
              <input
                type="text"
                className="form-control"
                id="categoryName"
                placeholder="Enter category name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="categoryDescription" className="form-label">
                Description
              </label>
              <input
                type="text"
                className="form-control"
                id="categoryDescription"
                placeholder="Enter description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            Create Category
          </button>
        </form>
      </div>

      {/* Categories Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Categories</h3>
          <span className="badge badge-primary">{categories.length} total</span>
        </div>

        {categories.length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
            </svg>
            <h3>No categories yet</h3>
            <p>Create your first category above</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>ID</th>
                  <th style={{ width: '180px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id}>
                    {editingCategory === category._id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            required
                            style={{ padding: '8px 12px' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            style={{ padding: '8px 12px' }}
                          />
                        </td>
                        <td>
                          <code style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                            {category._id.substring(0, 8)}...
                          </code>
                        </td>
                        <td>
                          <div className="actions">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleSave(category._id)}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ fontWeight: 500 }}>{category.name}</td>
                        <td className="text-muted">{category.description || "—"}</td>
                        <td>
                          <code style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                            {category._id.substring(0, 8)}...
                          </code>
                        </td>
                        <td>
                          <div className="actions">
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => handleEdit(category)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(category._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
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

export default CreateCetergory;
