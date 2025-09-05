"use client"

import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black px-6">
      {/* App Title */}
      <h1 className="text-4xl font-extrabold mb-4 text-center">
        🚀 Task Manager App
      </h1>
      <p className="text-lg text-gray-600 text-center max-w-xl mb-10">
        A simple and modern task manager built with <strong>Next.js</strong> and{" "}
        <strong>Supabase</strong>. Login to manage your tasks or try a demo
        version.
      </p>

      {/* Buttons */}
      <div className="flex gap-6">
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-medium shadow-lg hover:scale-105 transform transition"
        >
          Test App
        </Link>
        <Link
          href="/login"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg font-medium shadow-lg hover:scale-105 transform transition"
        >
          Login / Signup
        </Link>
      </div>
    </div>
  )
}
