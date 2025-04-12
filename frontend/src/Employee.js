/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style/User.css";
import Update from "./components/Update";
import { Link } from "react-router-dom";
import Add_skill from './components/Add_skill'
import API_BASE_URL from './config.js'

function Team_m() {
  const [user, setUser] = useState([]);
  const [user_skill, setUser_skill] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showForm2, setShowForm2] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  let id = localStorage.getItem("ID_Emp");

  console.log(id);
  const goBack = () => {
    window.history.back();
  };
  const handleAddUser = (newUser) => {
    setUser([...user, newUser]);
    setShowForm(false);
    setShowForm2(false);
  };
  const handleClose = () => {
    setShowForm(false);
    setShowForm2(false);
    setSelectedUser(null);
  };
  const handle_delete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete_skill/${id}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/user/${id}`)
      .then((res) => {
        setUser(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/EmployeeData/${id}`)
      .then((res) => {
        setUser_skill(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleUpdateUser = (data) => {
    setSelectedUser({ ...data });
  };

  return (
    <>
      <div className="page-container">
        <div className="user-container">
          <div className="user-header">
            <div className="add-container">
              <button className="user-button add-button" onClick={() => setShowForm(true)}>
                Add +
              </button>
              <button className="user-button add-button" onClick={goBack}>Back</button>
            </div>

            <table className="user-table">
              <thead>
                <tr>
                  <th className="user-table-header">Name</th>
                  <th className="user-table-header">Email</th>
                  <th className="user-table-header">Phone</th>
                </tr>
              </thead>
              <tbody>
                {user.map((data) => (
                  <tr key={data.user_id}>
                    <td>{data.Name}</td>
                    <td>{data.Email}</td>
                    <td>{data.Phone}</td>
                  </tr>
                ))}
              </tbody>

              <thead>
                <tr>
                  <th className="user-table-header">Training_name</th>
                  <th className="user-table-header">Training_state</th>
                </tr>
              </thead>
              <tbody>
                {user_skill.map((data) => (
                  <tr key={data.id}>
                    <td>{data.Training_name}</td>
                    <td>{data.Training_state}</td>
                    <td>
                      <button
                        className="user-button user-button-update"
                        onClick={() => setSelectedUser(data)}
                      >
                        <Link to={`/update/${data.id}`} className="btn btn-primary me-2">
                          Update
                        </Link>
                        &nbsp;
                      </button>
                    </td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showForm && <Add_skill handleAddUser={handleAddUser} onClose={handleClose} />}
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

export default Team_m;
