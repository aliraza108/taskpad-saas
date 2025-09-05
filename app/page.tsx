"use client"

import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-gray-900">
      {/* Hero Section */}
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          TaskPad
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-12">
          A modern, minimalist task manager SaaS built with Next.js & Supabase. 
          Organize your tasks, track progress, and increase productivity effortlessly.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300"
          >
            Try Demo
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300"
          >
            Login / Signup
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl">
        {[
          { title: "✅ Intuitive", desc: "Clean interface that’s easy to use and navigate." },
          { title: "⚡ Fast", desc: "Real-time updates with Supabase for instant feedback." },
          { title: "🔒 Secure", desc: "User authentication and data privacy you can trust." },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
          >
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-20 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} TaskPad. All rights reserved.
      </footer>
    </div>
  )
}
