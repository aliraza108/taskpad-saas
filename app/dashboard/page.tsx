"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

// ✅ Define proper types
type Task = {
  id: string
  title: string
  is_completed: boolean
  created_at: string
  user_id: string
}

type User = {
  id: string
  email: string
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all")

  // Fetch user + tasks
  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = "/login"
        return
      }
      setUser({ id: user.id, email: user.email || "" })

      const { data: tasksData, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) console.error(error)
      else setTasks(tasksData || [])

      setLoading(false)
    }

    getData()
  }, [])

  // Add new task
  const addTask = async () => {
    if (!newTask.trim() || !user) return

    const { data: newTasks, error } = await supabase
      .from("tasks")
      .insert([{ title: newTask, user_id: user.id }])
      .select()

    if (error) console.error("Insert Error:", error)
    else if (newTasks) setTasks([...newTasks, ...tasks])

    setNewTask("")
  }

  // Toggle complete
  const toggleTask = async (id: string, isCompleted: boolean) => {
    const { error } = await supabase
      .from("tasks")
      .update({ is_completed: !isCompleted })
      .eq("id", id)

    if (!error) {
      setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !isCompleted } : t))
    }
  }

  // Delete task
  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)

    if (!error) setTasks(tasks.filter(t => t.id !== id))
  }

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  // Handle enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask()
    }
  }

  // Filtered tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.is_completed
    if (filter === "pending") return !task.is_completed
    return true
  })

  const completedCount = tasks.filter(t => t.is_completed).length
  const totalCount = tasks.length

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="text-3xl font-bold text-gray-900">{totalCount}</div>
            <div className="text-sm text-gray-600 mt-1">Total Tasks</div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-6">
            <div className="text-3xl font-bold text-blue-600">{totalCount - completedCount}</div>
            <div className="text-sm text-blue-600 mt-1">Pending</div>
          </div>
          <div className="bg-green-50 rounded-2xl p-6">
            <div className="text-3xl font-bold text-green-600">{completedCount}</div>
            <div className="text-sm text-green-600 mt-1">Completed</div>
          </div>
        </div>

        {/* Add Task */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="What needs to be done?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <button
              onClick={addTask}
              disabled={!newTask.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
          {[
            { key: "all", label: "All Tasks", count: totalCount },
            { key: "pending", label: "Pending", count: totalCount - completedCount },
            { key: "completed", label: "Completed", count: completedCount }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as "all" | "completed" | "pending")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {label} {count > 0 && `(${count})`}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === "all" ? "No tasks yet" : `No ${filter} tasks`}
              </h3>
              <p className="text-gray-500">
                {filter === "all" 
                  ? "Add your first task above to get started"
                  : `You don't have any ${filter} tasks right now`
                }
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all ${
                  task.is_completed ? "opacity-75" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => toggleTask(task.id, task.is_completed)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        task.is_completed
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300 hover:border-green-500"
                      }`}
                    >
                      {task.is_completed && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <span
                      className={`text-gray-900 font-medium cursor-pointer ${
                        task.is_completed ? "line-through text-gray-500" : ""
                      }`}
                      onClick={() => toggleTask(task.id, task.is_completed)}
                    >
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleTask(task.id, task.is_completed)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                        task.is_completed
                          ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {task.is_completed ? "Undo" : "Complete"}
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}