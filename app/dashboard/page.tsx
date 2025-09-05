"use client"

import { useEffect, useRef, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

interface Task {
  id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
  user_id: string;
}

interface User {
  id: string;
  email?: string;
  [k: string]: any;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  // store client in ref so we reuse same instance (or null if not available)
  const supabaseRef = useRef<ReturnType<typeof getSupabaseClient> | null>(null);

  useEffect(() => {
    // set supabase client (browser only)
    supabaseRef.current = getSupabaseClient();

    if (!supabaseRef.current) {
      // missing envs or running in SSR — stop and show a message
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const userResponse = await supabaseRef.current!.auth.getUser();
        if (userResponse.error) {
          console.error("getUser error:", userResponse.error);
          window.location.href = "/login";
          return;
        }

        const currentUser = userResponse.data.user;
        if (!currentUser) {
          window.location.href = "/login";
          return;
        }

        setUser(currentUser as User);

        const { data: tasksData, error: tasksError } = await supabaseRef.current!
          .from<Task>("tasks")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false });

        if (tasksError) {
          console.error("tasks fetch error:", tasksError);
          setTasks([]);
        } else {
          setTasks(tasksData ?? []);
        }
      } catch (err) {
        console.error("fetchData error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  async function addTask() {
    if (!newTask.trim() || !user || !supabaseRef.current) return;

    try {
      const { data: inserted, error } = await supabaseRef.current
        .from<Task>("tasks")
        .insert([{ title: newTask, user_id: user.id }])
        .select("*");

      if (error) {
        console.error("Insert error:", error);
      } else if (inserted && inserted.length > 0) {
        // add new inserted items on top
        setTasks((prev) => [...inserted, ...prev]);
      }
    } catch (err) {
      console.error("addTask error:", err);
    } finally {
      setNewTask("");
    }
  }

  async function toggleTask(id: string, isCompleted: boolean) {
    if (!supabaseRef.current) return;

    try {
      const { error } = await supabaseRef.current
        .from("tasks")
        .update({ is_completed: !isCompleted })
        .eq("id", id);

      if (!error) {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, is_completed: !isCompleted } : t)));
      }
    } catch (err) {
      console.error("toggleTask error:", err);
    }
  }

  async function deleteTask(id: string) {
    if (!supabaseRef.current) return;

    try {
      const { error } = await supabaseRef.current.from("tasks").delete().eq("id", id);
      if (!error) setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("deleteTask error:", err);
    }
  }

  async function handleLogout() {
    if (!supabaseRef.current) return;
    try {
      await supabaseRef.current.auth.signOut();
      window.location.href = "/login";
    } catch (err) {
      console.error("logout error:", err);
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.is_completed;
    if (filter === "pending") return !task.is_completed;
    return true;
  });

  // If Supabase client didn't initialize (missing envs), show notice
  if (!supabaseRef.current) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold mb-2">Supabase not initialized</h2>
          <p className="text-sm text-gray-700">
            Make sure environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 relative">
        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-black drop-shadow-md">📝 My Tasks</h1>
            <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-red-400 hover:bg-red-500 text-black font-semibold shadow-md">
              🚪 Logout
            </button>
          </div>

          {/* Add Task */}
          <div className="flex mb-6">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="border border-gray-300 p-3 flex-grow rounded-xl text-black font-medium shadow-inner focus:ring-4 focus:ring-blue-300 focus:outline-none"
            />
            <button onClick={addTask} className="ml-3 px-6 py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-blue-400 to-purple-400 shadow-lg hover:scale-105 hover:shadow-xl transition-transform">
              ➕ Add
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-4 mb-6">
            {(["all", "completed", "pending"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl font-semibold shadow-md ${filter === f ? "bg-blue-700" : "bg-blue-300"}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Task List */}
          {loading ? (
            <p className="text-black-600 text-center">Loading...</p>
          ) : filteredTasks.length === 0 ? (
            <p className="text-black-500 text-center italic">No tasks here ✨</p>
          ) : (
            <ul className="space-y-4">
              {filteredTasks.map((task) => (
                <li key={task.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl shadow-md hover:shadow-xl transition">
                  <span className={`cursor-pointer font-medium text-black ${task.is_completed ? "line-through opacity-60" : ""}`} onClick={() => toggleTask(task.id, task.is_completed)}>
                    {task.title}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => toggleTask(task.id, task.is_completed)} className={`px-4 py-2 rounded-lg font-semibold text-black shadow-md transition ${task.is_completed ? "bg-green-300 hover:bg-green-400" : "bg-yellow-300 hover:bg-yellow-400"}`}>
                      {task.is_completed ? "✅ Done" : "⏳ Pending"}
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="px-4 py-2 rounded-lg bg-red-300 hover:bg-red-400 text-black font-semibold shadow-md">
                      🗑 Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
