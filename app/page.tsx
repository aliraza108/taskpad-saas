"use client"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Header Badge */}
        <div className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          <span className="text-sm font-medium text-blue-300">🇬🇧 Made in the UK</span>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            TaskFlow
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl font-light text-slate-300 mb-4">
            The minimal task manager that gets things done
          </p>
        </div>

        {/* Description */}
        <p className="text-lg text-slate-400 text-center max-w-2xl mb-12 leading-relaxed">
          Built for productivity enthusiasts who value <strong className="text-white">simplicity</strong> and 
          <strong className="text-white"> efficiency</strong>. Manage your tasks with British precision—
          no clutter, just results.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            href="/dashboard"
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-2">
              <span>Try Demo</span>
              <span className="text-xl">⚡</span>
            </span>
          </Link>
          
          <Link
            href="/login"
            className="group px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-lg font-semibold hover:bg-white/20 hover:border-white/30 transform hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              <span>Get Started</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
            <p className="text-slate-400 text-sm">Add and manage tasks in milliseconds. No lag, no fuss.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold mb-2">Focused Design</h3>
            <p className="text-slate-400 text-sm">Clean interface that keeps you focused on what matters.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="text-3xl mb-3">🔐</div>
            <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
            <p className="text-slate-400 text-sm">Your data stays safe with enterprise-grade security.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <p className="text-slate-500 text-sm">
            Powered by Next.js & Supabase
          </p>
        </div>
      </div>
    </div>
  )
}