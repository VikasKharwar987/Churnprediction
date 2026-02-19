import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://127.0.0.1:8000/register",
        form
      );

      alert("Account created successfully!");
      navigate("/login");

    } catch (err) {
      alert("Username already exists");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-10 rounded-xl shadow-md w-96">

        <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          Create Account
        </h2>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 p-3 border rounded-md"
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 border rounded-md"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 p-3 border rounded-md"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-black"
          >
            Register
          </button>

        </form>

        <p className="mt-6 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-gray-900 font-medium">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;
