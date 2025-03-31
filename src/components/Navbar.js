import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '10px' }}>
      <Link to="/" style={{ marginRight: '20px' }}>Home</Link>
      <Link to="/add">Add Image</Link>
    </nav>
  );
}

export default Navbar;