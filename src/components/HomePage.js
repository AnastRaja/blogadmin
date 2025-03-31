import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function HomePage() {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/images');
        setImages(response.data);
        const uniqueCategories = [...new Set(response.data.map(img => img.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Home Page</h2>
      {categories.length === 0 ? (
        <p>No images available</p>
      ) : (
        categories.map(category => (
          <div key={category}>
            <h3>{category}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {images
                .filter(img => img.category === category)
                .map(img => (
                  <div key={img._id} style={{ margin: '10px' }}>
                    <Link to={`/image/${img._id}`}>
                      <img
                        src={img.imagePath} // Use Cloudinary URL directly
                        alt={img.title}
                        style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                      />
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default HomePage;