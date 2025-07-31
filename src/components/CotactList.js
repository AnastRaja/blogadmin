import React, {useState, useEffect} from "react";
import axios from "axios";

function App() {
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_BASE_URL;
        const response = await axios.get(`${apiUrl}/api/contact`);

        console.log("✅ Raw API response:", response.data);

        // Handle both array and object responses
        let fetchedContacts = [];
        if (Array.isArray(response.data)) {
          fetchedContacts = response.data;
        } else if (response.data && Array.isArray(response.data.contacts)) {
          fetchedContacts = response.data.contacts;
        } else if (response.data && Array.isArray(response.data.data)) {
          fetchedContacts = response.data.data;
        }

        console.log("✅ Parsed Contacts:", fetchedContacts);

        setContacts(fetchedContacts);
        if (fetchedContacts.length === 0) {
          setMessage("No contacts available");
        }
      } catch (error) {
        console.error("❌ Error fetching contacts:", error);
        setMessage("Failed to load contacts");
        setContacts([]); // avoid undefined
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="App container mt-5">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Contact Submissions
      </h1>

      {message && (
        <div className="alert alert-danger text-center">{message}</div>
      )}

      <div className="mt-10">
        {contacts.length > 0 ? (
          <table className="table table-striped w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Country</th>
                <th>Contact Method</th>
                <th>Requirement</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact._id || contact.email}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.country}</td>
                  <td>{contact.contactMethod}</td>
                  <td>{contact.requirement}</td>
                  <td>
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
        ) : (
          <p className="text-center text-gray-500">No contacts available</p>
        )}
      </div>
    </div>
  );
}

export default App;
