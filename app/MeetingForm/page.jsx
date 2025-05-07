"use client";
import { useState } from "react";

export default function MeetingForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/scheduler-meeting", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      alert(data.message || "Meeting scheduled!");
    } catch (error) {
      console.error("Scheduling error:", error);
      alert("Failed to schedule meeting.");
    } finally {
      resetForm(); // ✅ always reset, whether success or fail
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white space-y-4"
    >
      <h2 className="text-xl font-bold">Schedule a Meeting</h2>

      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full Name"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="tel"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="time"
        name="time"
        value={form.time}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Schedule
      </button>
    </form>
  );
}
