"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useUser } from "../contexts/UserContext"
import { FaHeart, FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa"

function Header({ onToggleFavorites, darkMode: initialDarkMode, toggleDarkMode: onToggleDarkMode }) {
  const { user, logout } = useUser()
  const navigate = useNavigate()
  const [showFavorites, setShowFavorites] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(initialDarkMode)

  const handleFavoritesClick = () => {
    const newState = !showFavorites
    setShowFavorites(newState)
    onToggleFavorites(newState)
  }

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev
      if (typeof window !== "undefined") {
        localStorage.setItem("darkMode", newMode)
        // Apply dark mode class to document element for global effect
        if (newMode) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
      return newMode
    })
  }

  return (
    <header className="bg-white dark:bg-blue-900 text-blue-900 dark:text-white p-4 shadow-sm dark:shadow-indigo-900/10 sticky top-0 z-50 backdrop-blur-lg bg-white dark:bg-gray-900/90 border-b border-gray-100 dark:border-gray-800">
  <div className="max-w-6xl mx-auto flex justify-between items-center">
    <motion.h1
      className="text-3xl font-extrabold tracking-wide select-none text-white drop-shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      CountryBook
    </motion.h1>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <motion.button
            onClick={handleFavoritesClick}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition-all duration-300 ${
              showFavorites
                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            } shadow hover:shadow-md`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-pressed={showFavorites}
            aria-label="Toggle favorite countries view"
          >
            <FaHeart className={`text-xl ${showFavorites ? "text-white" : "text-red-500"}`} />
            {showFavorites ? "Show All Countries" : "View Favorites"}
          </motion.button>

          {/* Dark mode toggle */}
          <motion.button
            onClick={handleToggleDarkMode}
            aria-label="Toggle dark mode"
            className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow hover:shadow-md"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={darkMode ? "dark" : "light"}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {darkMode ? (
                  <FaSun className="text-yellow-400 text-xl" />
                ) : (
                  <FaMoon className="text-blue-600 text-xl" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {user && (
            <>
              <div className="relative group">
                <motion.div
                  className="flex items-center gap-3 bg-blue-50 dark:bg-indigo-900/30 text-blue-700 dark:text-indigo-300 px-4 py-2 rounded-full cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-gradient-to-r dark:from-indigo-500 dark:to-purple-600 flex items-center justify-center text-white font-bold shadow">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm sm:text-base">
                    <strong>{user.username}</strong>
                  </span>
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 dark:bg-gradient-to-r dark:from-indigo-500 dark:to-purple-600 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                <motion.div
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 origin-top-right"
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  whileHover={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Signed in as</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.username}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => navigate("/profile")}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                    >
                      Your Profile
                    </button>
                    <button
                      onClick={() => navigate("/settings")}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        logout()
                        navigate("/login")
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </div>

        {/* Mobile Navigation Menu - Update styles to match the new theme */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-white dark:bg-gray-900 z-40 md:hidden flex flex-col items-center justify-center gap-6 p-6"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                onClick={handleFavoritesClick}
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-300 w-full justify-center ${
                  showFavorites
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                } shadow`}
                whileTap={{ scale: 0.95 }}
                aria-pressed={showFavorites}
                aria-label="Toggle favorite countries view"
              >
                <FaHeart className={`text-xl ${showFavorites ? "text-white" : "text-red-500"}`} />
                {showFavorites ? "Show All Countries" : "View Favorites"}
              </motion.button>

              {/* Dark mode toggle */}
              <motion.button
                onClick={handleToggleDarkMode}
                aria-label="Toggle dark mode"
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow w-full flex items-center justify-center gap-2"
                whileTap={{ scale: 0.95 }}
              >
                {darkMode ? (
                  <>
                    <FaSun className="text-yellow-400 text-xl" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <FaMoon className="text-blue-600 text-xl" />
                    <span>Dark Mode</span>
                  </>
                )}
              </motion.button>

              {user && (
                <>
                  <div className="w-full flex items-center justify-center mb-2">
                    <div className="w-16 h-16 rounded-full bg-blue-600 dark:bg-gradient-to-r dark:from-indigo-500 dark:to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-indigo-900/30 text-blue-700 dark:text-indigo-300 px-4 py-3 rounded-full w-full text-center mb-2">
                    <span className="text-base font-medium">
                      Welcome, <strong>{user.username}</strong>
                    </span>
                  </div>
                  <motion.button
                    onClick={() => navigate("/profile")}
                    className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors flex items-center justify-center"
                    whileTap={{ scale: 0.95 }}
                  >
                    Your Profile
                  </motion.button>
                  <motion.button
                    onClick={() => navigate("/settings")}
                    className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors flex items-center justify-center"
                    whileTap={{ scale: 0.95 }}
                  >
                    Settings
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      logout()
                      navigate("/login")
                      setIsMenuOpen(false)
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-full font-semibold shadow transition-all duration-300 w-full flex items-center justify-center"
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign out
                  </motion.button>
                </>
              )}

              <motion.button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes className="h-6 w-6" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header
