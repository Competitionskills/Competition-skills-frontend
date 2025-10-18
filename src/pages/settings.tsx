import React, { useEffect, useState } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/Header";

const Settings: React.FC = () => {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    postCode: "",
    phoneNumber: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // 🧩 Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("https://api.scoreperks.co.uk/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setForm({
          fullName: res.data.fullName || "",
          username: res.data.username || "",
          postCode: res.data.postCode || "",
          phoneNumber: res.data.phoneNumber || "",
          email: res.data.email || "",
        });
      } catch (err) {
        console.error("❌ Error fetching user:", err);
        setError("Failed to load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUser();
  }, [token]);

  // 🧩 Auto-clear alerts after 3 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  // 🧩 Input Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhoneChange = (value: string) =>
    setForm({ ...form, phoneNumber: value });

  // 🧩 Save Profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await axios.put(
        "https://api.scoreperks.co.uk/api/users/me",
        {
          fullName: form.fullName,
          username: form.username,
          phone: form.phoneNumber,
          postCode: form.postCode,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message || "Profile updated successfully!");
    } catch (err) {
      console.error("❌ Update failed:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // 🧩 Loader
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
     

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Alert Banner */}
        {(message || error) && (
          <div
            className={`text-center py-3 font-medium transition-all ${
              message
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {message || error}
          </div>
        )}

        {/* Settings Content */}
        <main className="p-6 md:p-10">
          <div className="bg-white shadow-md rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6 text-center">
              Account Settings
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <PhoneInput
                  country="gb"
                  value={form.phoneNumber}
                  onChange={handlePhoneChange}
                  inputStyle={{
                    width: "100%",
                    height: "42px",
                    fontSize: "15px",
                    borderRadius: "0.5rem",
                    borderColor: "#d1d5db",
                  }}
                  buttonStyle={{
                    backgroundColor: "transparent",
                    borderColor: "#d1d5db",
                  }}
                />
              </div>

              {/* Post Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Post Code
                </label>
                <input
                  type="text"
                  name="postCode"
                  value={form.postCode}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={saving}
                className={`w-full py-2 text-white rounded-lg font-medium transition ${
                  saving
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500"
                }`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
