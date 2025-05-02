"use client"
import { motion } from "framer-motion"
import { FaSearch } from "react-icons/fa"

function SearchBar({ onSearch }) {
  return (
    <div className="my-4 relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FaSearch className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <motion.input
          type="text"
          placeholder="Search for a country..."
          className="w-full pl-12 p-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/30 focus:border-indigo-500 dark:focus:border-indigo-500"
          onChange={(e) => onSearch(e.target.value)}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(99, 102, 241, 0)",
              "0 0 0 4px rgba(99, 102, 241, 0.1)",
              "0 0 0 0 rgba(99, 102, 241, 0)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
        />
      </div>
    </div>
  )
}

export default SearchBar
