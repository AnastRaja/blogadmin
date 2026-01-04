import React, { useState } from "react";
import axios from "axios";

function AddImagePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("image", image);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/images`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage("Image uploaded successfully!");
      setTitle("");
      setDescription("");
      setCategory("");
      setImage(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Failed to upload image");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Add New Image</h1>
        <p className="page-subtitle">Upload an image to your gallery</p>
      </div>

      {message && (
        <div className={`alert ${message.includes("success") ? "alert-success" : "alert-error"}`}>
          {message}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter image title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="Enter image description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
            ></textarea>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image File</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setImage(e.target.files[0])}
                required
                accept="image/*"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            Upload Image
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddImagePage;
