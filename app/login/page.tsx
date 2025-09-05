"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
    } else {
      router.push("/dashboard") // ✅ go to dashboard
    }
    setLoading(false)
  }

  const handleSignup = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      alert(error.message)
    } else {
      router.push("/dashboard") // ✅ go to dashboard after signup
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center text-black mb-6">Login / Signup</h1>

        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 p-3 mb-3 w-full rounded-xl text-black focus:ring-2 focus:ring-blue-300 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-3 mb-6 w-full rounded-xl text-black focus:ring-2 focus:ring-blue-300 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mb-3 bg-gradient-to-r from-blue-400 to-blue-600 text-black font-semibold py-3 rounded-xl shadow-md hover:scale-105 transition"
        >
          Login
        </button>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-400 to-green-600 text-black font-semibold py-3 rounded-xl shadow-md hover:scale-105 transition"
        >
          Signup
        </button>
      </div>
    </div>
  )
}
