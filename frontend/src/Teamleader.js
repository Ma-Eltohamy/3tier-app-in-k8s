/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style/User.css";
import Addform from "./components/Addform";
import Update from "./components/Update";
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from './config.js';

let team_name;
function Teamleader() {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showForm2, setShowForm2] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  let id = localStorage.getItem("team_leader_ID");

  const goBack = () => {
    window.history.back();
  };

  const go_to_page = () => {
    navigate(`/login/DashBoard/Teamleader/Team_m`);
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/AllTeamLeaderData/${id}`)
      .then((res) => {
        setUser(res.data);
        team_name = res.data[0].Team_id;
        console.log(team_name);
        localStorage.removeItem('team_name');
        localStorage.setItem('team_name', team_name);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const getTypeBackgroundColor = (type) => {
    switch (type) {
      case 1:
        return "#6A0DAD";
      case 2:
        return "#0077B6";
      case 3:
        return "#FFA500";
      default:
        return "#FFFFFF";
    }
  };

  const handleAddUser = (newUser) => {
    setUser([...user, newUser]);
    setShowForm(false);
    setShowForm2(false);
  };

  const handleUpdateUser = (data) => {
    setSelectedUser({ ...data });
  };

  const handleClose = () => {
    setShowForm(false);
    setShowForm2(false);
    setSelectedUser(null);
  };

  return (
    <>
      <div className="page-container">
        <div className="user-container">
          <div className="user-header">
            <div className="add-container">
              <button className="user-button add-button" onClick={goBack}>Back</button>
              <button className="user-button add-button" onClick={go_to_page}>Members</button>
            </div>

            <table className="user-table">
              <thead>
                <tr>
                  <th className="user-table-header">Name</th>
                  <th className="user-table-header">Email</th>
                  <th className="user-table-header">Phone</th>
                  <th className="user-table-header">Status</th>
                </tr>
              </thead>
              <tbody>
                {user.map((data) => (
                  <tr key={data.user_id}>
                    <td>{data.Name}</td>
                    <td>{data.Email}</td>
                    <td>{data.Phone}</td>
                    <td style={{ backgroundColor: data.Status === 1 ? "#28a745" : "#dc3545" }}>
                      {data.Status === 1 ? "Active" : "Inactive"}
                    </td>
                    <td
                      style={{
                        backgroundColor: getTypeBackgroundColor(data.Type),
                        color: "#FFFFFF",
                      }}
                    >
                      {data.Type === 2 ? "team_leader" : "employee"}
                    </td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showForm && <Addform handleAddUser={handleAddUser} onClose={handleClose} />}
          {selectedUser && (
            <Update
              onUpdateUser={handleUpdateUser}
              formData={selectedUser}
            />
          )}
        </div>
      </div>
    </>
  );
}

export { Teamleader, team_name };
