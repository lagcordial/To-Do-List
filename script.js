import { useState, useEffect } from "react";
import TaskCard from "./components/TaskCard";
import "./index.css";

const STORAGE_KEY = "taskflow-react";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    reminder: "none",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setTasks(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!form.title.trim()) return alert("Task title required");

    const newTask = {
      id: crypto.randomUUID(),
      ...form,
      createdAt: Date.now(),
    };

    setTasks([...tasks, newTask]);

    fetch("http://localhost:4000/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });

    setForm({ title: "", date: "", time: "", reminder: "none" });
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-slate-900/40 rounded-lg shadow-xl text-white">
      <h1 className="text-xl font-bold mb-4">TaskFlow — React + Tailwind</h1>

      <div className="grid gap-2 mb-4">
        <input
          className="p-2 rounded bg-slate-800 border border-slate-700"
          placeholder="Task title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            className="p-2 rounded bg-slate-800"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <input
            type="time"
            className="p-2 rounded bg-slate-800"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />
        </div>

        <select
          className="p-2 rounded bg-slate-800"
          value={form.reminder}
          onChange={(e) => setForm({ ...form, reminder: e.target.value })}
        >
          <option value="none">No Reminder</option>
          <option value="0">At time</option>
          <option value="5">5 minutes before</option>
          <option value="15">15 minutes before</option>
        </select>

        <button
          onClick={addTask}
          className="bg-blue-500 p-2 rounded hover:bg-blue-600 font-bold"
        >
          Add Task
        </button>
      </div>

      <div className="grid gap-3">
        {tasks.length === 0 && <p className="text-slate-400">No tasks yet.</p>}
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={deleteTask} />
        ))}
      </div>
    </div>
  );
}
