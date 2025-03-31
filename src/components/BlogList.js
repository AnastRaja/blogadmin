import React, {useState, useEffect} from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  const [blogs, setBlogs] = useState([]); // New state for blogs

  // Fetch blogs when the component mounts
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setMessage("Failed to load blogs");
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="App container mt-5">
      {/* Category Creation Form */}
      <h1 className="text-3xl font-bold mb-6 text-center">Blog List</h1>

      {/* Blogs Table */}
      <div className="mt-10">
        {blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs available</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Category</th>
                <th scope="col">Slug</th>
                <th scope="col">Created At</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>{blog.title}</td>
                  <td>{blog.description || "N/A"}</td>
                  <td>{blog.category}</td>
                  <td>{blog.slug}</td>
                  <td>
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
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
