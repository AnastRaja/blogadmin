import React, {useState, useEffect} from "react";
import axios from "axios";
import {Editor} from "@tinymce/tinymce-react";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/categories`
        );
        setCategories(response.data);
        if (response.data.length > 0) {
          setCategory(response.data[0].name);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setMessage("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("body", body);
    formData.append("category", category);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/blogs`,
        formData,
        {
          headers: {"Content-Type": "multipart/form-data"},
        }
      );
      setMessage("Blog created successfully!");
      console.log("Blog created:", response.data);
      setTitle("");
      setDescription("");
      setBody("");
      setImage(null);
    } catch (error) {
      console.error("Error creating blog:", error);
      setMessage(
        "Failed to create blog: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="App container mt-5">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a New Blog</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-4 bg-white shadow-md rounded"
      >
        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">
            Blog Title
          </label>
          <input
            type="text"
            class="form-control"
            id="exampleFormControlInput1"
            placeholder="Enter Blog Title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">
            Description
          </label>
          <input
            type="text"
            class="form-control"
            id="exampleFormControlInput1"
            placeholder="Enter Blog Description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {/* <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 font-semibold mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div> */}
        {/* <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-semibold mb-2"
          ></label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div> */}
        <div className="mb-4">
          <label
            htmlFor="body"
            className="block text-gray-700 font-semibold mb-2"
          >
            Blog Body
          </label>
          <Editor
            apiKey="cvs1vqum97ix28l3oye8rbxrtdq8sjt0rgx5stf666pd13ei" // Get a free key from TinyMCE website
            value={body}
            onEditorChange={(newValue) => setBody(newValue)}
            init={{
              height: 300,
              menubar: true,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
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
            }}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-700 font-semibold mb-2"
          >
            Category
          </label>

          <select
            id="category"
            class="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            // className="w-full p-2 border rounded"
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
        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-gray-700 font-semibold mb-2"
          >
            Blog Image
          </label>
          <input
            type="file"
            class="form-control"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <button type="submit" class="btn btn-primary mr-auto">
          Create Blog
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
    </div>
  );
}

export default App;
