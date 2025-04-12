import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config"; // Import the centralized API URL

function AddUserForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    status: "",
    type: "",
    Team_id: ""
  });

  const [Team_IDS, setTeam_IDS] = useState([]);
  
  useEffect(() => {
    fetch(`${API_BASE_URL}/AllTeam_IDS`)
      .then((data) => data.json())
      .then((val) => setTeam_IDS(val));
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`${API_BASE_URL}/Add_User`, formData)
      .then((res) => {
        console.log(res);
        alert(res.data);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 400) {
          console.log(err.response.data);
        } else {
          console.log("Error creating user");
        }
      });
  };

  return (
    <div className="form-modal">
      <div className="form-modal-content">
        <h2>Add User</h2>
        <form onSubmit={handleFormSubmit} className="add-user-form">
        
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} />

          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} />

          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleInputChange} />

          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />

          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleInputChange}>
            <option value="0">Inactive</option>
            <option value="1">Active</option>
          </select>

          <label>Type:</label>
          <select name="type" onChange={handleInputChange} value={formData.type}>
            <option value="">--SELECT--</option>
            <option value="2">Team_leader</option>
            <option value="3">Employee</option>
          </select>

          <label>TeamLeader_id:</label>
          <select name="Team_id" value={formData.Team_id} onChange={handleInputChange}>
            {Team_IDS.map((data) => (
              <option key={data.ID} value={data.ID}>{data.ID}</option>
            ))}
          </select>

          <button type="submit">Done</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
}

export default AddUserForm;
