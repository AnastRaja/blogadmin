import React, { useState, useEffect } from "react";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import { useParams, useNavigate } from "react-router-dom";

function BlogUpload() {
  const { id } = useParams(); // Get ID for edit mode
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null); // New image file
  const [existingImage, setExistingImage] = useState(null); // URL of existing image
  const [blogId, setBlogId] = useState(null); // Store actual ID for updates
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/categories`
        );
        setCategories(response.data);
        if (!isEditMode && response.data.length > 0) {
          setCategory(response.data[0].name);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setMessage("Failed to load categories");
      }
    };
    fetchCategories();
  }, [isEditMode]);

  // Fetch Blog Data if Edit Mode
  useEffect(() => {
    if (isEditMode) {
      const fetchBlog = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/blogs/${id}`
          );
          const blog = response.data;
          setBlogId(response.data._id); // Capture the actual ID for updates
          setTitle(blog.title);
          setDescription(blog.description);
          setBody(blog.body);
          setCategory(blog.category);
          setExistingImage(blog.image); // Assuming API returns 'image' or 'imagePath'
        } catch (error) {
          console.error("Error fetching blog details:", error);
          setMessage("Failed to load blog details for editing");
        }
      };
      fetchBlog();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("body", body);
    formData.append("category", category);

    // Only append image if a new one is selected
    if (image) {
      formData.append("image", image);
    }

    try {
      if (isEditMode) {
        // Edit Mode: PUT request (Use blogId captured from fetch)
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/api/blogs/${blogId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setMessage("Blog updated successfully!");
        // Optional: Redirect after success
        // setTimeout(() => navigate("/BlogList"), 1500);
      } else {
        // Create Mode: POST request
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/blogs`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setMessage("Blog created successfully!");
        console.log("Blog created:", response.data);
        // Reset form
        setTitle("");
        setDescription("");
        setBody("");
        setImage(null);
        setExistingImage(null);
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      setMessage(
        `Failed to ${isEditMode ? "update" : "create"} blog: ` +
        (error.response?.data?.message || "Unknown error")
      );
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{isEditMode ? "Edit Blog" : "Create a New Blog"}</h1>
        <p className="page-subtitle">
          {isEditMode ? "Update your blog content" : "Fill in the details below to publish your blog post"}
        </p>
      </div>

      {message && (
        <div className={`alert ${message.includes("success") ? "alert-success" : "alert-error"}`}>
          {message}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Blog Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              placeholder="Enter blog title"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="description"
              placeholder="Enter a short description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="body" className="form-label">
              Blog Content
            </label>
            <Editor
              apiKey="cvs1vqum97ix28l3oye8rbxrtdq8sjt0rgx5stf666pd13ei"
              value={body}
              onEditorChange={(newValue) => setBody(newValue)}
              init={{
                height: 350,
                menubar: true,
                plugins: "advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount",
                toolbar:
                  "undo redo | formatselect | fontfamily fontsize | bold italic underline | " +
                  "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | " +
                  "link image | removeformat | code",
                font_family_formats:
                  "Arial=arial,helvetica,sans-serif; " +
                  "Courier New=courier new,courier,monospace; " +
                  "Georgia=georgia,palatino; " +
                  "Times New Roman=times new roman,times; " +
                  "Verdana=verdana,geneva; " +
                  "Comic Sans MS=comic sans ms,sans-serif; " +
                  "Impact=impact,charcoal; " +
                  "Tahoma=tahoma,arial,helvetica,sans-serif",
                skin: "oxide",
                content_css: "default",
              }}
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                className="form-control form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.length === 0 ? (
                  <option value="">No categories available</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="image" className="form-label">
                Featured Image
              </label>
              {existingImage && !image && (
                <div style={{ marginBottom: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  Current image: <a href={existingImage} target="_blank" rel="noreferrer">View</a>
                </div>
              )}
              <input
                type="file"
                className="form-control"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                required={!isEditMode && !existingImage} // Required only if creating or no existing image
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            {isEditMode ? "Update Blog" : "Publish Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BlogUpload;
