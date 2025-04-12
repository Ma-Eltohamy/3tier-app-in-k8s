/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style/User.css";
import Update from "./components/Update";
import { Link } from "react-router-dom";
import API_BASE_URL from "./config.js";

function Team_m() {
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const goBack = () => {
    window.history.back();
  };

  let id = localStorage.getItem("team_name");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/MemberData/${id}`)
      .then((res) => {
        setUser(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleUpdateUser = (data) => {
    setSelectedUser({ ...data });
  };

  return (
    <>
      <div className="page-container">
        <div className="user-container">
          <div className="user-header">
            <div className="add-container">
              <button className="user-button add-button" onClick={goBack}>Back</button>
            </div>

            <table className="user-table">
              <thead>
                <tr>
                  <th className="user-table-header">Name</th>
                  <th className="user-table-header">Email</th>
                  <th className="user-table-header">Training_name</th>
                  <th className="user-table-header">Training_state</th>
                  <th className="user-table-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {user.map((data) => (
                  <tr key={data.ID}>
                    <td>{data.Name}</td>
                    <td>{data.Email}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
