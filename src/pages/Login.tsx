import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ Initialize navigate function

  // ✅ Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
  
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", form);
  
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        setMessage("Login successful! Redirecting...");
  
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (error: unknown) {
      console.error("❌ Login Error:", error);
    
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data?.message || "Login failed. Please try again.");
      } else {
        setMessage("An unexpected error occurred.");
      }
    }
    
  };
  
  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
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
        <button type="submit" style={styles.button}>Login</button>
      </form>
      {message && <p style={message.includes("successful") ? styles.successMessage : styles.errorMessage}>
        {message}
      </p>}
    </div>
  );
};




// ✅ Basic Styling for UI
const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "300px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    textAlign: "center" as const, // ✅ Explicitly type 'textAlign'
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const, // ✅ Explicitly type 'flexDirection'
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


export default Login;
