import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import { registerUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await registerUser(formData);

      login(data);

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Signup failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-6">
          Signup
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full border p-3 mb-4 rounded"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 mb-4 rounded"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 mb-4 rounded"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-black text-white p-3 rounded"
        >
          Signup
        </button>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;