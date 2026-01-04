import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function ImageDetailsPage() {
  const { id } = useParams();
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

  if (error) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Image Details</h1>
        </div>
        <div className="alert alert-error">{error}</div>
        <Link to="/" className="btn btn-secondary">Back to Home</Link>
      </div>
    );
  }

  if (!image) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Image Details</h1>
        </div>
        <div className="card">
          <div className="empty-state">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <Link to="/" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back
          </Link>
        </div>
        <h1 className="page-title">{image.title}</h1>
        <p className="page-subtitle">
          <span className="badge badge-primary">{image.category}</span>
        </p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <img
            src={image.imagePath}
            alt={image.title}
            style={{
              width: '100%',
              borderRadius: 'var(--radius-md)',
              objectFit: 'cover',
            }}
          />
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Image Details</h3>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ marginBottom: '4px' }}>Title</label>
            <p style={{ margin: 0, fontWeight: 500 }}>{image.title}</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ marginBottom: '4px' }}>Description</label>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{image.description}</p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ marginBottom: '4px' }}>Category</label>
            <p style={{ margin: 0 }}>
              <span className="badge badge-primary">{image.category}</span>
            </p>
          </div>

          <a href={image.imagePath} download className="btn btn-primary" style={{ display: 'inline-flex' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Download Image
          </a>
        </div>
      </div>
    </div>
  );
}

export default ImageDetailsPage;
