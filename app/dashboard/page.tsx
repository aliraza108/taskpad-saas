"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

interface Task {
  id: string
  title: string
  is_completed: boolean
  created_at: string
  user_id: string
}

interface User {
  id: string
  email: string
  [key: string]: any
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all")

  useEffect(() => {
    const getData = async () => {
      // Fetch the user
      const {
        data: { user: supabaseUser },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        console.error(userError)
        window.location.href = "/login"
        return
      }

      if (!supabaseUser) {
        window.location.href = "/login"
        return
      }

      // Properly type the user
      const typedUser: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || "",
        ...supabaseUser,
      }

      setUser(typedUser)

      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from<Task>("tasks")
        .select("*")
        .eq("user_id", typedUser.id)
        .order("created_at", { ascending: false })

      if (tasksError) console.error(tasksError)
      else setTasks(tasksData || [])

      setLoading(false)
    }

    getData()
  }, [])

  const addTask = async () => {
    if (!newTask.trim() || !user) return

    const { data: insertedTasks, error } = await supabase
      .from<Task>("tasks")
      .insert([{ title: newTask, user_id: user.id }])
      .select("*")

    if (error) console.error("Insert Error:", error)
    else if (insertedTasks) setTasks([...insertedTasks, ...tasks])

    setNewTask("")
  }

  const toggleTask = async (id: string, isCompleted: boolean) => {
    const { error } = await supabase
      .from("tasks")
      .update({ is_completed: !isCompleted })
      .eq("id", id)

    if (!error) setTasks(tasks.map(t => (t.id === id ? { ...t, is_completed: !isCompleted } : t)))
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id)
    if (!error) setTasks(tasks.filter(t => t.id !== id))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.is_completed
    if (filter === "pending") return !task.is_completed
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 relative">
        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-black drop-shadow-md">📝 My Tasks</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-400 hover:bg-red-500 text-black font-semibold shadow-md"
            >
              🚪 Logout
            </button>
          </div>

          {/* Add Task */}
          <div className="flex mb-6">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              className="border border-gray-300 p-3 flex-grow rounded-xl text-black font-medium shadow-inner focus:ring-4 focus:ring-blue-300 focus:outline-none"
            />
            <button
              onClick={addTask}
              className="ml-3 px-6 py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-blue-400 to-purple-400 shadow-lg hover:scale-105 hover:shadow-xl transition-transform"
            >
              ➕ Add
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-4 mb-6">
            {["all", "completed", "pending"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as "all" | "completed" | "pending")}
                className={`px-4 py-2 rounded-xl font-semibold shadow-md ${
                  filter === f ? "bg-blue-700" : "bg-blue-300"
                }`}
              >
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
              {filteredTasks.map(task => (
                <li
                  key={task.id}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl shadow-md hover:shadow-xl transition"
                >
                  <span
                    className={`cursor-pointer font-medium text-black ${
                      task.is_completed ? "line-through opacity-60" : ""
                    }`}
                    onClick={() => toggleTask(task.id, task.is_completed)}
                  >
                    {task.title}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleTask(task.id, task.is_completed)}
                      className={`px-4 py-2 rounded-lg font-semibold text-black shadow-md transition ${
                        task.is_completed
                          ? "bg-green-300 hover:bg-green-400"
                          : "bg-yellow-300 hover:bg-yellow-400"
                      }`}
                    >
                      {task.is_completed ? "✅ Done" : "⏳ Pending"}
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="px-4 py-2 rounded-lg bg-red-300 hover:bg-red-400 text-black font-semibold shadow-md"
                    >
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
  )
}
