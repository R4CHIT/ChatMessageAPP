import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./Login.css"; // Import your CSS file


function Register() {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });

  const {error, register } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    register(credentials);
  };

  const renderError = (field) => {
    if (error && error[field]){
      const message = Array.isArray(error[field]) ? error[field] : [error[field]]
      return message.map((msg, index) => <p key={index} className="error-message"><small>{msg}</small></p>);
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Register</h2>

        <input
          type="text"
          className="login-input"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
        />
        {renderError("username")}
        <input
          type="text"
          className="login-input"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
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
        {renderError("password")}
        <button type="submit" className="login-button">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
