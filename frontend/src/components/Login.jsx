import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./Login.css"; // Import your CSS file
import { useNavigate, Link } from "react-router-dom";

function Login() {
  
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "rachit",
    password: "rachit",
  });

  const { Login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    Login(credentials, navigate);
  };

  

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Login</h2>

        <input
          type="text"
          className="login-input"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
        />

        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />

        <button type="submit" className="login-button">
          Login
        </button>
        
        <p className="register-prompt">
          Don't have account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;