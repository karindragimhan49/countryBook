"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FaHeart, FaGlobe, FaUsers, FaMapMarkerAlt } from "react-icons/fa"

function CountryCard({ country }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const username = localStorage.getItem("user")
    if (username) {
      const allUsers = JSON.parse(localStorage.getItem("users")) || {}
      const user = allUsers[username]
      if (user?.favorites.includes(country.cca3)) {
        setIsFavorite(true)
      }
    }
  }, [country.cca3])

  const handleFavoriteToggle = () => {
    const username = localStorage.getItem("user")
    if (!username) return

    const allUsers = JSON.parse(localStorage.getItem("users")) || {}
    const user = allUsers[username]

    if (isFavorite) {
      user.favorites = user.favorites.filter((code) => code !== country.cca3)
    } else {
      user.favorites.push(country.cca3)
    }

    allUsers[username] = user
    localStorage.setItem("users", JSON.stringify(allUsers))
    setIsFavorite(!isFavorite)
  }

  // Format population with commas
  const formatPopulation = (population) => {
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <div
      className="h-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg dark:shadow-indigo-900/10 border border-gray-100 dark:border-gray-700 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/country/${country.cca3}`} className="block h-full">
        <div className="relative overflow-hidden">
          <motion.div
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-48 relative"
          >
            <img
              src={country.flags.png || "/placeholder.svg"}
              alt={country.name.common}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>

          {/* Country Code Badge */}
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
            {country.cca3}
          </div>

          {/* Region Badge */}
          <div className="absolute top-3 right-3 bg-indigo-600/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <FaGlobe className="mr-1" size={10} />
            {country.region}
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-1">{country.name.common}</h2>
            <motion.button
              onClick={(e) => {
                e.preventDefault() // Prevent navigation when clicking the heart
                handleFavoriteToggle()
              }}
              whileTap={{ scale: 0.9 }}
              className="text-2xl transition-colors duration-300"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <motion.div
                animate={
                  isFavorite
                    ? { scale: [1, 1.3, 1], color: ["#f87171", "#ef4444", "#ef4444"] }
                    : { scale: 1, color: "#9ca3af" }
                }
                transition={{ duration: 0.3 }}
              >
                <FaHeart className={isFavorite ? "text-red-500" : "text-gray-400"} />
              </motion.div>
            </motion.button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <FaMapMarkerAlt className="mr-2 text-indigo-500 dark:text-indigo-400" />
              <span className="font-medium">Capital:</span>
              <span className="ml-2 truncate">{country.capital?.[0] || "N/A"}</span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <FaUsers className="mr-2 text-indigo-500 dark:text-indigo-400" />
              <span className="font-medium">Population:</span>
              <span className="ml-2">{formatPopulation(country.population)}</span>
            </div>
          </div>

          {/* View Details Button */}
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <span className="inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
              View Details →
            </span>
          </motion.div>
        </div>
      </Link>
    </div>
  )
}

export default CountryCard
