import React, {useState, useEffect} from "react";
import axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null); // Track the category being edited
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Fetch categories when the component mounts
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

  // Handle form submission to create a new category
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/categories`,
        {name, description},
        {
          headers: {"Content-Type": "application/json"},
        }
      );
      setMessage("Category created successfully!");
      console.log("Category created:", response.data);
      setName("");
      setDescription("");
      // Refresh the categories list
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

  // Handle delete category
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
      // Refresh the categories list
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

  // Handle edit category (start editing)
  const handleEdit = (category) => {
    setEditingCategory(category._id);
    setEditName(category.name);
    setEditDescription(category.description || "");
  };

  // Handle save after editing
  const handleSave = async (id) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/categories/${id}`,
        {name: editName, description: editDescription},
        {
          headers: {"Content-Type": "application/json"},
        }
      );
      setMessage("Category updated successfully!");
      console.log("Category updated:", response.data);
      setEditingCategory(null);
      // Refresh the categories list
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

  // Handle cancel editing
  const handleCancel = () => {
    setEditingCategory(null);
    setEditName("");
    setEditDescription("");
  };

  return (
    <div className="App container mt-5">
      {/* Category Creation Form */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        Create a New Category
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-4 bg-white shadow-md rounded"
      >
        <div className="mb-3">
          <label htmlFor="categoryName" className="form-label">
            Category Name
          </label>
          <input
            type="text"
            className="form-control"
            id="categoryName"
            placeholder="Enter Category Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="categoryDescription" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="categoryDescription"
            placeholder="Enter Category Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Category
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-center ${
            message.includes("success") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      {/* Categories Table */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center">All Categories</h2>
        {categories.length === 0 ? (
          <p className="text-center text-gray-500">No categories available</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">ID</th>
                <th scope="col">Actions</th>
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
                        />
                      </td>
                      <td>
                        <textarea
                          className="form-control"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={1}
                        />
                      </td>
                      <td>{category._id}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm mr-2"
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
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{category.name}</td>
                      <td>{category.description || "N/A"}</td>
                      <td>{category._id}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm mr-2"
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
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
