import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000'
});

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
  
    try {
      // Updated endpoint to match backend route
      const response = await api.post("/api/users/signup", form);
      setMessage(response.data.message || "Signup successful! Redirecting...");
  
      // Store the token in localStorage
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }
  
      // Redirect to login after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: unknown) {
      console.error("Signup Error:", error);
    
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data?.message || "Signup failed. Please try again.");
      } else {
        setMessage("An unexpected error occurred.");
      }
    }
    
  };
  
  return (
    <div style={styles.container}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Sign Up</button>
      </form>
      {message && (
  <p style={message.includes("successful") ? styles.successMessage : styles.errorMessage}>
    {message}
  </p>
)}

    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "300px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    textAlign: "center", // ✅ This is valid as it matches the expected type
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column", // ✅ Fix flexDirection by ensuring it's correctly typed
    gap: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  errorMessage: {
    marginTop: "10px",
    color: "#dc3545",
    fontWeight: "bold",
  },
  successMessage: {
    marginTop: "10px",
    color: "#28a745",
    fontWeight: "bold",
  },
};


export default Signup;