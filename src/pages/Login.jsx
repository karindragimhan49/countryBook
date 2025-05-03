"use client"

import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useUser } from "../contexts/UserContext"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaUser,
  FaLock,
  FaGlobe,
  FaSignInAlt,
  FaUserPlus,
  FaSun,
  FaMoon,
  FaArrowRight,
  FaExclamationCircle,
} from "react-icons/fa"

// Sample country flags for the background animation
const countryFlags = [
  "https://flagcdn.com/w320/us.png", // USA
  "https://flagcdn.com/w320/gb.png", // UK
  "https://flagcdn.com/w320/fr.png", // France
  "https://flagcdn.com/w320/de.png", // Germany
  "https://flagcdn.com/w320/jp.png", // Japan
  "https://flagcdn.com/w320/br.png", // Brazil
  "https://flagcdn.com/w320/in.png", // India
  "https://flagcdn.com/w320/ca.png", // Canada
  "https://flagcdn.com/w320/au.png", // Australia
  "https://flagcdn.com/w320/za.png", // South Africa
  "https://flagcdn.com/w320/cn.png", // China
  "https://flagcdn.com/w320/mx.png", // Mexico
  "https://flagcdn.com/w320/it.png", // Italy
  "https://flagcdn.com/w320/es.png", // Spain
  "https://flagcdn.com/w320/ru.png", // Russia
]

function Login() {
  const navigate = useNavigate()
  const { login } = useUser()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Check dark mode from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = localStorage.getItem("darkMode") === "true"
      setDarkMode(isDark)
      if (isDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev
      if (typeof window !== "undefined") {
        localStorage.setItem("darkMode", newMode)
        if (newMode) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
      return newMode
    })
  }

  const handleLogin = async () => {
    if (username.trim() && password.trim()) {
      setIsLoading(true)
      setError("")

      // Simulate network delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 800))

      const allUsers = JSON.parse(localStorage.getItem("users")) || {}
      const user = allUsers[username]

      if (user && user.password === password) {
        login(username)
        navigate("/")
      } else {
        setError("Invalid username or password")
        setIsLoading(false)
      }
    } else {
      setError("Both fields are required")
    }
  }

  const handleRegister = async () => {
    if (username.trim() && password.trim()) {
      setIsLoading(true)
      setError("")

      // Simulate network delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 800))

      const allUsers = JSON.parse(localStorage.getItem("users")) || {}

      if (allUsers[username]) {
        setError("Username already exists")
        setIsLoading(false)
      } else {
        allUsers[username] = { password, favorites: [] }
        localStorage.setItem("users", JSON.stringify(allUsers))
        login(username)
        navigate("/")
      }
    } else {
      setError("Both fields are required")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isRegister) {
      handleRegister()
    } else {
      handleLogin()
    }
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } transition-colors duration-500`}
    >
      {/* Animated Background with Country Flags */}
      <div className="absolute inset-0 overflow-hidden">
        {countryFlags.map((flag, index) => (
          <motion.div
            key={index}
            className="absolute opacity-20 rounded-lg overflow-hidden shadow-lg"
            style={{
              width: Math.random() * 80 + 60,
              height: Math.random() * 50 + 40,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -1000],
              rotate: [0, Math.random() * 360],
              opacity: [0.2, 0],
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 20,
              ease: "linear",
            }}
          >
            <img src={flag || "/placeholder.svg"} alt="Country flag" className="w-full h-full object-cover" />
          </motion.div>
        ))}
      </div>

      {/* Dark Mode Toggle */}
      <motion.button
        className={`absolute top-6 right-6 p-3 rounded-full z-10 ${
          darkMode
            ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
            : "bg-white text-blue-600 hover:bg-gray-100 shadow-md"
        } transition-colors duration-300`}
        onClick={toggleDarkMode}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        <motion.div initial={false} animate={{ rotate: darkMode ? 180 : 0 }} transition={{ duration: 0.5 }}>
          {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
        </motion.div>
      </motion.button>

      {/* Globe Icon */}
      <motion.div
        className="mb-8"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
      >
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center ${
            darkMode ? "bg-gradient-to-br from-indigo-600 to-purple-700" : "bg-gradient-to-br from-blue-500 to-blue-700"
          } shadow-lg`}
        >
          <FaGlobe className="text-white text-4xl" />
        </div>
      </motion.div>

      {/* Main Card */}
      <motion.div
        className={`w-full max-w-md relative z-10 overflow-hidden ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } rounded-2xl shadow-2xl transition-colors duration-500`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Card Header with Animated Gradient */}
        <div
          className={`p-8 ${
            darkMode ? "bg-gradient-to-r from-indigo-900 to-purple-900" : "bg-gradient-to-r from-blue-500 to-blue-700"
          } transition-colors duration-500`}
        >
          <motion.h1
            className="text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {isRegister ? "Create Account" : "Welcome Back"}
          </motion.h1>
          <motion.p
            className="text-blue-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {isRegister ? "Register to explore countries around the world" : "Sign in to continue your journey"}
          </motion.p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={isRegister ? "register" : "login"}
                initial={{ opacity: 0, x: isRegister ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRegister ? -100 : 100 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Username Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } transition-colors duration-300`}
                  >
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser
                        className={`${darkMode ? "text-gray-500" : "text-gray-400"} transition-colors duration-300`}
                      />
                    </div>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      type="text"
                      id="username"
                      placeholder="Enter your username"
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        error && !username.trim()
                          ? "border-red-500 dark:border-red-500"
                          : darkMode
                            ? "border-gray-700 bg-gray-700"
                            : "border-gray-300 bg-gray-50"
                      } rounded-xl shadow-sm focus:outline-none focus:ring-4 ${
                        darkMode
                          ? "focus:ring-indigo-500/30 focus:border-indigo-500 text-white"
                          : "focus:ring-blue-500/20 focus:border-blue-500 text-gray-900"
                      } transition-colors duration-300`}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } transition-colors duration-300`}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock
                        className={`${darkMode ? "text-gray-500" : "text-gray-400"} transition-colors duration-300`}
                      />
                    </div>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter your password"
                      className={`block w-full pl-10 pr-10 py-3 border ${
                        error && !password.trim()
                          ? "border-red-500 dark:border-red-500"
                          : darkMode
                            ? "border-gray-700 bg-gray-700"
                            : "border-gray-300 bg-gray-50"
                      } rounded-xl shadow-sm focus:outline-none focus:ring-4 ${
                        darkMode
                          ? "focus:ring-indigo-500/30 focus:border-indigo-500 text-white"
                          : "focus:ring-blue-500/20 focus:border-blue-500 text-gray-900"
                      } transition-colors duration-300`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                        } transition-colors duration-300`}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center text-red-500 text-sm p-2 bg-red-100 dark:bg-red-900/20 rounded-lg"
                    >
                      <FaExclamationCircle className="mr-2 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center py-3 px-4 rounded-xl text-white font-medium ${
                    isLoading
                      ? "opacity-80 cursor-not-allowed"
                      : "hover:shadow-lg transform transition-all duration-300"
                  } ${
                    isRegister
                      ? darkMode
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                        : "bg-gradient-to-r from-green-500 to-emerald-600"
                      : darkMode
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600"
                        : "bg-gradient-to-r from-blue-500 to-blue-700"
                  } transition-colors duration-300`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      {isRegister ? <FaUserPlus className="mr-2" /> : <FaSignInAlt className="mr-2" />}
                      <span>{isRegister ? "Create Account" : "Sign In"}</span>
                    </div>
                  )}
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </form>

          {/* Toggle between Login and Register */}
          <div className="mt-8 text-center">
            <motion.button
              className={`inline-flex items-center text-sm ${
                darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-blue-600 hover:text-blue-700"
              } transition-colors duration-300`}
              onClick={() => {
                setIsRegister(!isRegister)
                setError("")
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{isRegister ? "Already have an account? Sign in" : "Don't have an account? Register"}</span>
              <FaArrowRight className="ml-1 text-xs" />
            </motion.button>
          </div>
        </div>

        {/* Card Footer */}
        <div
          className={`px-8 py-4 text-center text-sm ${
            darkMode ? "bg-gray-900/50 text-gray-400" : "bg-gray-50 text-gray-500"
          } transition-colors duration-300`}
        >
          <p>Explore the world with Country Book</p>
        </div>
      </motion.div>

      {/* Animated Globe at the Bottom */}
      <motion.div
        className="absolute bottom-10 opacity-10"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 60,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <div className="w-96 h-96 rounded-full border-4 border-dashed border-gray-400 dark:border-gray-600"></div>
      </motion.div>
    </div>
  )
}

export default Login
