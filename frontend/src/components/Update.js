import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from '../config'; // Import the base URL

function Update() {
  const [Training_name, setTraining_name] = useState("");
  const [Training_state, setTraining_state] = useState("");

  const goBack = () => {
    window.history.back();
  };

  const { id } = useParams();
  let id2;
  console.log(id);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/user_training/${id}`) // Use the base URL
      .then((res) => {
        console.log(res.data);
        id2 = res.data[0].id;
        console.log(id2);
        setTraining_name(res.data[0].Training_name);
        setTraining_state(res.data[0].Training_state);
      })
      .catch((err) => console.log(err));
  }, [id]);

  function handleSubmit(event) {
    event.preventDefault();
    axios
      .put(`${API_BASE_URL}/Update_User_training/${id}`, { Training_name, Training_state }) // Use the base URL
      .then((res) => {
        goBack();
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="form-modal">
      <div className="form-modal-content">
        <h2>Update User</h2>
        <form onSubmit={handleSubmit} className="add-user-form">
          <label>Training_name:</label>
          <input type="text" name="Training_name" value={Training_name} onChange={(e) => setTraining_name(e.target.value)} />

          <label>Training_state:</label>
          <input type="text" name="Training_state" value={Training_state} onChange={(e) => setTraining_state(e.target.value)} />

          <button type="submit">Done</button>
        </form>
      </div>
    </div>
  );
}

export default Update;
