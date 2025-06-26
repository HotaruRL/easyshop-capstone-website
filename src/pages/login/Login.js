import { useState } from "react";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    /*
        By default, browser reloads the entire page when we submit an HTML form.
        The next line prevents that so submission can be handled smoothly without a flash or reload.
        */
    e.preventDefault();

    // handle success or failure
    try {
      // API call to backend
      const response = await axios.post("http://localhost:8080/login", {
        username: username,
        password: password,
      });

      // get token from a the successful response
      const token = response.data.token;

      // store the token in the browser's storage
      localStorage.setItem("token", token);

      console.log("Login successful!");

      // redirect the user to another page after a successful login
      window.location.href = "/";
    } catch (err) {
      setError("Invalid username or password");
      console.error("Login failed:", err);
    }
  };

  // return HTML as JSX - what the user sees
  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
