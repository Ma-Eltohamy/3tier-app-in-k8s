import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from '../config'; // Import the base URL from config.js

function Update_user() {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Phone, setPhone] = useState("");
  const [Status, setStatus] = useState("");
  const [Type, setType] = useState("");
  const [Team_id, setTeam_id] = useState("");
  const [Team_IDS, setTeam_IDS] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/AllTeam_IDS`) // Use API_BASE_URL for consistency
      .then((data) => data.json())
      .then((val) => setTeam_IDS(val));
  }, []);

  const { id } = useParams();

  const goBack = () => {
    window.history.back();
  };

  function handleSubmit(event) {
    event.preventDefault();
    axios
      .put(`${API_BASE_URL}/update/${id}`, { Name, Email, Password, Phone, Status, Type, Team_id }) // Updated URL with API_BASE_URL
      .then((res) => {
        console.log(res.data);
        goBack();
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="form-modal">
      <div className="form-modal-content">
        <h2>Update User</h2>
        <form onSubmit={handleSubmit} className="add-user-form">
          <label>Name:</label>
          <input type="text" name="name" onChange={(e) => setName(e.target.value)} />

          <label>Email:</label>
          <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} />

          <label>Password:</label>
          <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} />

          <label>Phone:</label>
          <input type="text" name="phone" onChange={(e) => setPhone(e.target.value)} />

          <label>Status:</label>
          <select name="status" onChange={(e) => setStatus(e.target.value)}>
            <option value="0">Inactive</option>
            <option value="1">Active</option>
          </select>

          <label>Type:</label>
          <select name="type" onChange={(e) => setType(e.target.value)}>
            <option value="">--SELECT--</option>
            <option value="1">Admin</option>
            <option value="2">Team_leader</option>
            <option value="3">employee</option>
          </select>

          <label>TeamLeader_id:</label>
          <select name="Team_id" onChange={(e) => setTeam_id(e.target.value)}>
            {Team_IDS.map((data) => (
              <option key={data.ID} value={data.ID}>
                {data.ID}
              </option>
            ))}
          </select>

          <button type="submit">Update User</button>
        </form>
      </div>
    </div>
  );
}

export default Update_user;
