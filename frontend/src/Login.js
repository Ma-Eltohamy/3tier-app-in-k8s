import React from "react";
import { useEffect, useState } from "react";
import './style/Login.css';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import validation from './loginvalidation';
import axios from "axios";
import API_BASE_URL from "./config";

let ID_Admin, ID_Emp, team_leader_ID;

function Login() {
  const navigate = useNavigate();
  const [values, setvalues] = useState({
    email: '',
    password: ''
  });

  const Email = values.email;
  const Password = values.password;

  const [errors, seterror] = useState({});

  const handleInput = (e) => {
    setvalues(prev => ({
      ...prev, [e.target.name]: e.target.value
    }));
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/login/${Email}/${Password}`, values)
      .then((res) => {
        // let status = res.data[0].Status;
      })
      .catch((err) => console.log(err));
  }, [Email, Password, values]);

  const handle = (e) => {
    e.preventDefault();
    seterror(validation(values));

    if (errors.email === "" && errors.password === "") {
      axios.get(`${API_BASE_URL}/login/${Email}/${Password}`, values)
        .then(res => {
          console.log(res.data);
          if (res.data[0].Type === 1 && res.data[0].Ss !== 0) {
            ID_Admin = res.data[0].user_id;
            localStorage.removeItem('ID_Admin');
            localStorage.setItem('ID_Admin', ID_Admin);
            navigate('/login/DashBoard');
          } else if (res.data[0].Type === 2 && res.data[0].Status !== 0) {
            team_leader_ID = res.data[0].user_id;
            localStorage.removeItem('team_leader_ID');
            localStorage.setItem('team_leader_ID', team_leader_ID);
            navigate(`/login/DashBoard/Teamleader/${team_leader_ID}`);
          } else if (res.data[0].Type === 3 && res.data[0].Status !== 0) {
            ID_Emp = res.data[0].user_id;
            localStorage.removeItem('ID_Emp');
            localStorage.setItem('ID_Emp', ID_Emp);
            navigate(`/login/DashBoard/Employee/${ID_Emp}`);
          } else {
            alert("Email is Wrong OR this user is not available right now");
            console.log("errrrrr");
          }
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <div className='loginClass'>
      <div className='loginContiner'>
        <h2 className='FormName'>Log-in</h2>
        <form onSubmit={handle}>
          <div className='loginForm'>
            <label htmlFor='email'><FaEnvelope /> Email</label>
            <input type='email' placeholder='Enter Email' onChange={handleInput} name='email' />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>

          <div className='loginForm'>
            <label htmlFor='password'><FaLock /> Password</label>
            <input type='password' onChange={handleInput} placeholder='Enter Password' name='password' />
            {errors.password && <span className="text-danger">{errors.password}</span>}
          </div>

          <button className='btn btn-success' type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export { Login, ID_Admin, ID_Emp, team_leader_ID };
