"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "../components/Header"
import SearchBar from "../components/SearchBar"
import FilterBar from "../components/FilterBar"
import CountryCard from "../components/CountryCard"
import { getAllCountries } from "../services/api"
import { FaGlobe, FaMapMarkerAlt, FaLanguage } from "react-icons/fa"

function Home() {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [showFavorites, setShowFavorites] = useState(false)
  const [topRegions, setTopRegions] = useState([])
  const [topLanguages, setTopLanguages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true" || window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return false
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const data = await getAllCountries()
      setCountries(data)
      setFilteredCountries(data)

      const regionCounts = data.reduce((acc, country) => {
        acc[country.region] = (acc[country.region] || 0) + 1
        return acc
      }, {})
      const sortedRegions = Object.entries(regionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([region]) => region)
      setTopRegions(sortedRegions)

      const languageCounts = data.reduce((acc, country) => {
        Object.values(country.languages || {}).forEach((language) => {
          acc[language] = (acc[language] || 0) + 1
        })
        return acc
      }, {})
      const sortedLanguages = Object.entries(languageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([language]) => language)
      setTopLanguages(sortedLanguages)

      setTimeout(() => setIsLoading(false), 800) // Add slight delay for smoother loading animation
    }
    fetchData()
  }, [])

  useEffect(() => {
    let results = countries

    if (showFavorites) {
      const username = localStorage.getItem("user")
      const allUsers = JSON.parse(localStorage.getItem("users")) || {}
      const user = allUsers[username]
      if (user) {
        results = results.filter((country) => user.favorites.includes(country.cca3))
      }
    }

    if (searchQuery) {
      results = results.filter((country) => country.name.common.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (selectedRegion) {
      results = results.filter((country) => country.region === selectedRegion)
    }

    if (selectedLanguage) {
      results = results.filter((country) => Object.values(country.languages || {}).includes(selectedLanguage))
    }

    setFilteredCountries(results)
  }, [searchQuery, selectedRegion, selectedLanguage, countries, showFavorites])

  // Toggle dark mode and store preference
  const toggleDarkMode = () => {
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

  // Update the initial darkMode state to reflect system preference and apply it
  useEffect(() => {
    const isDark =
      localStorage.getItem("darkMode") === "true" ||
      (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches)

    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const statsVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 0.2,
      },
    },
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-500 overflow-hidden">
        <Header onToggleFavorites={setShowFavorites} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        {/* Hero Section with Animated Background */}
        <div className="relative overflow-hidden">
          {/* Update the light mode hero section gradient to be more professional
  Replace the hero section background div */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-violet-600 dark:to-indigo-800 opacity-80 dark:opacity-80"></div>
          <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-10"></div>

          {/* Animated Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white opacity-20"
                style={{
                  width: Math.random() * 10 + 5,
                  height: Math.random() * 10 + 5,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, Math.random() * -100 - 50],
                  x: [0, Math.random() * 50 - 25],
                  opacity: [0.2, 0],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          <div className="relative py-20 mb-10 z-10">
            <motion.div
              className="max-w-6xl mx-auto px-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-5xl md:text-6xl font-extrabold mb-5 tracking-tight text-white drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Explore Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                  World
                </span>
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl max-w-3xl text-indigo-100 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Discover details about countries around the globe, from population and languages to currencies and time
                zones.
              </motion.p>

              <motion.div
                className="mt-8 flex space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <a
                  href="#country-list"
                  className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  Explore Countries
                </a>
                <button
                  onClick={() => setShowFavorites(!showFavorites)}
                  className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  {showFavorites ? "Show All Countries" : "View Favorites"}
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
              <path
                fill={darkMode ? "#0f172a" : "#f8fafc"}
                fillOpacity="1"
                d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              ></path>
            </svg>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-12 relative z-10">
          {/* Stats Banner */}
          <motion.div
            className="flex flex-wrap justify-around items-center mb-10 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl dark:shadow-indigo-900/20 transition-colors duration-300 border border-gray-100 dark:border-gray-700"
            variants={statsVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { label: "Countries", value: countries.length, icon: <FaGlobe className="w-6 h-6 text-indigo-500" /> },
              {
                label: "Regions",
                value: topRegions.length,
                icon: <FaMapMarkerAlt className="w-6 h-6 text-indigo-500" />,
              },
              {
                label: "Languages",
                value: topLanguages.length,
                icon: <FaLanguage className="w-6 h-6 text-indigo-500" />,
              },
              {
                label: showFavorites ? "Favorites" : "Save Favorites",
                value: showFavorites
                  ? (() => {
                      const username = localStorage.getItem("user")
                      const allUsers = JSON.parse(localStorage.getItem("users")) || {}
                      return allUsers[username]?.favorites?.length || 0
                    })()
                  : "❤️",
                icon: (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                    className="text-red-500"
                  >
                    ❤️
                  </motion.div>
                ),
              },
            ].map(({ label, value, icon }) => (
              <motion.div
                key={label}
                className="text-center p-4 flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="mb-2">{icon}</div>
                <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-300 text-transparent bg-clip-text">
                  {value}
                </p>
                <p className="text-gray-600 dark:text-gray-300 font-medium">{label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Search Section */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl dark:shadow-indigo-900/20 transition-colors duration-300 mb-10 border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.h2
              className="text-3xl font-semibold mb-8 text-gray-900 dark:text-gray-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Find Your Country
            </motion.h2>
            <SearchBar onSearch={setSearchQuery} />
            <FilterBar
              onRegionChange={setSelectedRegion}
              onLanguageChange={setSelectedLanguage}
              regions={topRegions}
              languages={topLanguages}
            />
          </motion.div>

          {/* Results Section */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl dark:shadow-indigo-900/20 transition-colors duration-300 border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <motion.h2
                className="text-3xl font-semibold text-gray-900 dark:text-gray-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {showFavorites ? "Your Favorite Countries" : "Countries"}
              </motion.h2>
              <motion.span
                className="text-sm font-medium px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {filteredCountries.length} results
              </motion.span>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="relative w-24 h-24">
                  <div className="absolute top-0 left-0 w-full h-full border-8 border-indigo-200 dark:border-indigo-900/30 rounded-full"></div>
                  <motion.div
                    className="absolute top-0 left-0 w-full h-full border-8 border-transparent border-t-indigo-600 dark:border-t-indigo-400 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  ></motion.div>
                </div>
              </div>
            ) : (
              <AnimatePresence>
                <motion.div
                  id="country-list"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <motion.div
                        key={country.cca3}
                        variants={itemVariants}
                        whileHover={{
                          scale: 1.03,
                          transition: { duration: 0.2 },
                        }}
                      >
                        <CountryCard country={country} />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      className="text-center col-span-full py-16 text-gray-600 dark:text-gray-400 select-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <svg
                        className="w-20 h-20 mx-auto mb-6 text-gray-400 dark:text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-2xl">No countries found.</p>
                      <p className="mt-2">Try adjusting your search or filters.</p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        </div>

        {/* Footer with Animated Gradient */}
        <footer className="relative overflow-hidden bg-gray-900 text-gray-300 py-12 mt-16 shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-violet-900/20"></div>

          {/* Animated Dots */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white opacity-10"
                style={{
                  width: Math.random() * 4 + 2,
                  height: Math.random() * 4 + 2,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, Math.random() * -50 - 20],
                  opacity: [0.1, 0],
                }}
                transition={{
                  duration: Math.random() * 5 + 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300">
                Country Book
              </h3>
              <p className="mb-6 text-gray-400">Explore our beautiful world, one country at a time.</p>
              <div className="flex justify-center space-x-6 mb-8">
                {["Facebook", "Twitter", "Instagram", "GitHub"].map((social) => (
                  <a key={social} href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    {social}
                  </a>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Country Book | All rights reserved
              </p>
            </motion.div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Home
