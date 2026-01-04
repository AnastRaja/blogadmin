import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function HomePage() {
  const [blogCount, setBlogCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, contactsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/blogs`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/contact`)
        ]);

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Process Blogs
        const recentBlogs = blogsRes.data.filter(blog => new Date(blog.createdAt) > oneWeekAgo);
        setBlogCount(recentBlogs.length);

        // Process Contacts
        let contactsData = [];
        if (Array.isArray(contactsRes.data)) {
          contactsData = contactsRes.data;
        } else if (contactsRes.data && Array.isArray(contactsRes.data.contacts)) {
          contactsData = contactsRes.data.contacts;
        } else if (contactsRes.data && Array.isArray(contactsRes.data.data)) {
          contactsData = contactsRes.data.data;
        }

        const recentContactsList = contactsData.filter(contact => new Date(contact.createdAt) > oneWeekAgo);

        // Sort by date descending
        recentContactsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setContactCount(recentContactsList.length);
        setRecentContacts(recentContactsList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">Activity summary for the last 7 days</p>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="text-muted mb-0" style={{ fontSize: '14px', marginBottom: '8px' }}>Blogs Uploaded (Last 7 Days)</p>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>{loading ? "..." : blogCount}</h2>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="text-muted mb-0" style={{ fontSize: '14px', marginBottom: '8px' }}>New Contacts (Last 7 Days)</p>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>{loading ? "..." : contactCount}</h2>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#d1fae5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Contact Submissions (Last 7 Days)</h3>
        </div>

        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : recentContacts.length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <h3>No recent contacts</h3>
            <p>No contact submissions in the last week.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {recentContacts.map((contact) => (
                  <tr key={contact._id || contact.email}>
                    <td style={{ fontWeight: 500 }}>{contact.name}</td>
                    <td>
                      <a href={`mailto:${contact.email}`} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                        {contact.email}
                      </a>
                    </td>
                    <td>
                      {new Date(contact.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td className="text-muted" style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {contact.requirement}
                    </td>
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

export default HomePage;
