import React, {useState, useEffect} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";

function ImageDetailsPage() {
  const {id} = useParams();
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/images/${id}`
        );
        setImage(response.data);
      } catch (err) {
        console.error("Error fetching image:", err);
        setError("Failed to load image details");
      }
    };
    fetchImage();
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!image) return <div>Loading...</div>;

  return (
    <div style={{padding: "20px"}}>
      <h2>{image.title}</h2>
      <img
        src={image.imagePath} // Use Cloudinary URL directly
        alt={image.title}
        style={{maxWidth: "100%"}}
      />
      <p>{image.description}</p>
      <p>Category: {image.category}</p>
      <a href={image.imagePath} download>
        <button>Download Image</button>
      </a>
    </div>
  );
}

export default ImageDetailsPage;
