import React, { useState, useEffect } from "react";
import axios from "axios";

function CotactList() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [message, setMessage] = useState("");

  // Filter States
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_BASE_URL;
        const response = await axios.get(`${apiUrl}/api/contact`);

        let fetchedContacts = [];
        if (Array.isArray(response.data)) {
          fetchedContacts = response.data;
        } else if (response.data && Array.isArray(response.data.contacts)) {
          fetchedContacts = response.data.contacts;
        } else if (response.data && Array.isArray(response.data.data)) {
          fetchedContacts = response.data.data;
        }

        setContacts(fetchedContacts);
        setFilteredContacts(fetchedContacts);
        if (fetchedContacts.length === 0) {
          setMessage("No contacts available");
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setMessage("Failed to load contacts");
        setContacts([]);
      }
    };

    fetchContacts();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = contacts;

    if (selectedMonth) {
      result = result.filter(contact => {
        const contactDate = new Date(contact.createdAt);
        // getMonth() returns 0-11, so we add 1 to match 1-12 range if needed, or just compare index
        // Let's assume selectedMonth is "0" to "11" string
        return contactDate.getMonth().toString() === selectedMonth;
      });
    }

    if (selectedDate) {
      result = result.filter(contact => {
        const contactDate = new Date(contact.createdAt);
        return contactDate.getDate().toString() === selectedDate;
      });
    }

    setFilteredContacts(result);
  }, [selectedMonth, selectedDate, contacts]);

  const resetFilters = () => {
    setSelectedMonth("");
    setSelectedDate("");
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Contact Submissions</h1>
        <p className="page-subtitle">View and filter all contact form submissions</p>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '20px', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label">Filter by Month</label>
            <select
              className="form-control form-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">All Months</option>
              {months.map((month, index) => (
                <option key={index} value={index.toString()}>{month}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label className="form-label">Filter by Date</label>
            <input
              type="number"
              className="form-control"
              placeholder="Day (1-31)"
              min="1"
              max="31"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div>
            <button className="btn btn-secondary" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {message && !contacts.length && (
        <div className="alert alert-warning">{message}</div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Contacts List</h3>
          <span className="badge badge-primary">{filteredContacts.length} found</span>
        </div>

        {filteredContacts.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Country</th>
                  <th>Contact Method</th>
                  <th>Requirement</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact._id || contact.email}>
                    <td style={{ fontWeight: 500 }}>{contact.name}</td>
                    <td>
                      <a href={`mailto:${contact.email}`} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                        {contact.email}
                      </a>
                    </td>
                    <td className="text-muted">{contact.phone}</td>
                    <td>{contact.country}</td>
                    <td>
                      <span className="badge badge-success">{contact.contactMethod}</span>
                    </td>
                    <td className="text-muted" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {contact.requirement}
                    </td>
                    <td className="text-muted">
                      {new Date(contact.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <h3>No contacts found</h3>
            <p>Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CotactList;
