import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/login",
        { username, password }
      );

      onLogin(res.data.access_token);
      navigate("/dashboard");

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-10 rounded-xl shadow-md w-96">

        <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          Login to ChurnSense
        </h2>

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-black transition"
          >
            Login
          </button>

        </form>

        <p className="mt-6 text-sm text-gray-600 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-gray-900 font-medium">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
