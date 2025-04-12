/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./style/User.css";
import Addform from "./components/Addform";
import Sidebar_Admin from "./components/Sidebar_Admin";
import { Link, useNavigate } from "react-router-dom";
import Update_user from "./components/Update_user";
import API_BASE_URL from './config.js';

function DashBoard() {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showForm2, setShowForm2] = useState(false);
  const [showForm3, setShowForm3] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterValue, setFilterValue] = useState("");

  const goBack = () => {
    window.history.back();
  };

  const GoTo = () => {
    navigate(`/login/DashBoard/MemberSkills`);
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/AllUsersData`)
      .then((res) => {
        setUser(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

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

  const handleAdd_teamLeader = (newUser) => {
    setUser([...user, newUser]);
    setShowForm(false);
    setShowForm3(false);
  };

  const handle_delete = async (user_id) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete_user/${user_id}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
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
      <Sidebar_Admin logo={<i className="bx bxs-school"></i>} name="FCIH " openOnHover={false} />
      <div className="page-container">
        <div className="user-container">
          <div className="user-header">
            <div className="add-container">
              <button className="user-button add-button" onClick={GoTo}>
                Member_Skills +
              </button>
              <button className="user-button add-button" onClick={() => setShowForm(true)}>
                Add +
              </button>
              <button className="user-button add-button" onClick={goBack}>
                Back
              </button>
            </div>
            <div className="filter-container">
              <h4>Filter by Type</h4>
              <select value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
                <option value="">All</option>
                <option value="2">Team_Leaders</option>
                <option value="3">Employees</option>
              </select>
            </div>
            <table className="user-table">
              <thead>
                <tr>
                  <th className="user-table-header">Name</th>
                  <th className="user-table-header">Email</th>
                  <th className="user-table-header">Phone</th>
                  <th className="user-table-header">Status</th>
                  <th className="user-table-header">Type</th>
                  <th className="user-table-header">NameOfTeam</th>
                  <th className="user-table-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {user
                  .filter((data) => {
                    if (!filterValue) return true;
                    return data.Type.toString() === filterValue;
                  })
                  .map((data) => (
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
                        {data.Type === 2 ? "TeamLeader" : "Employee"}
                      </td>
                      <td>{data.NameOfTeam}</td>
                      <td>
                        <button
                          className="user-button user-button-update"
                          onClick={() => setSelectedUser(data)}
                        >
                          <Link to={`/update_user/${data.user_id}`} className="btn btn-primary me-2">
                            <FaEdit />
                            Update_user
                          </Link>
                          &nbsp;
                        </button>
                        <button
                          className="user-button user-button-delete"
                          onClick={() => handle_delete(data.user_id)}
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {showForm && <Addform handleAddUser={handleAddUser} onClose={handleClose} />}
          {showForm3 && <Addform handleAddUser={handleAdd_teamLeader} onClose={handleClose} />}
          {selectedUser && (
            <Update_user
              onUpdateUser={handleUpdateUser}
              formData={selectedUser}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default DashBoard;
