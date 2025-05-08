"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Header from "../components/Header"
import SearchBar from "../components/SearchBar"
import FilterBar from "../components/FilterBar"
import CountryCard from "../components/CountryCard"
import { getAllCountries } from "../services/api"
import { FaGlobe, FaMapMarkerAlt, FaLanguage, FaSearch, FaCompass } from "react-icons/fa"

// Sample country flags for animations - reduced number for better performance
const popularFlags = [ // USA
  
  "https://flagcdn.com/w320/gb.png", // UK // France// Japan
  "https://flagcdn.com/w320/lk.png",
  "https://flagcdn.com/w320/br.png", // Brazil
  "https://flagcdn.com/w320/in.png", // India
  "https://flagcdn.com/w320/au.png", // Australia

   // Sri Lanka
]

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
      try {
        setIsLoading(true)
        const data = await getAllCountries()

        if (Array.isArray(data)) {
          // Store countries in localStorage for direct access from detail page
          localStorage.setItem("allCountries", JSON.stringify(data))

          setCountries(data)
          setFilteredCountries(data)

          // Process regions
          const regionCounts = data.reduce((acc, country) => {
            if (country && country.region) {
              acc[country.region] = (acc[country.region] || 0) + 1
            }
            return acc
          }, {})

          const sortedRegions = Object.entries(regionCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([region]) => region)

          setTopRegions(sortedRegions)

          // Process languages
          const languageCounts = data.reduce((acc, country) => {
            if (country && country.languages) {
              Object.values(country.languages).forEach((language) => {
                if (language) {
                  acc[language] = (acc[language] || 0) + 1
                }
              })
            }
            return acc
          }, {})

          const sortedLanguages = Object.entries(languageCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([language]) => language)

          setTopLanguages(sortedLanguages)
        } else {
          console.error("API did not return an array:", data)
          setCountries([])
          setFilteredCountries([])
          setTopRegions([])
          setTopLanguages([])
        }
      } catch (error) {
        console.error("Error fetching countries:", error)
        setCountries([])
        setFilteredCountries([])
        setTopRegions([])
        setTopLanguages([])
      } finally {
        // Add slight delay for smoother loading animation
        setTimeout(() => setIsLoading(false), 800)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    try {
      let results = countries

      if (showFavorites) {
        const username = localStorage.getItem("user")
        const allUsers = JSON.parse(localStorage.getItem("users")) || {}
        const user = allUsers[username]
        if (user && Array.isArray(user.favorites)) {
          results = results.filter((country) => user.favorites.includes(country.cca3))
        }
      }

      if (searchQuery) {
        results = results.filter(
          (country) =>
            country.name &&
            country.name.common &&
            country.name.common.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      if (selectedRegion) {
        results = results.filter((country) => country.region === selectedRegion)
      }

      if (selectedLanguage) {
        results = results.filter(
          (country) => country.languages && Object.values(country.languages).includes(selectedLanguage),
        )
      }

      setFilteredCountries(results)
    } catch (error) {
      console.error("Error filtering countries:", error)
      // Keep the current filtered countries to avoid breaking the UI
    }
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

        // Dispatch an event to notify components of dark mode change
        try {
          const event = new CustomEvent("darkModeChange", { detail: { darkMode: newMode } })
          document.dispatchEvent(event)
        } catch (error) {
          console.error("Error dispatching dark mode event:", error)
        }
      }
      return newMode
    })
  }

  // Update the initial darkMode state to reflect system preference and apply it
  useEffect(() => {
    try {
      const isDark =
        localStorage.getItem("darkMode") === "true" ||
        (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches)

      setDarkMode(isDark)
      if (isDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    } catch (error) {
      console.error("Error setting initial dark mode:", error)
    }
  }, [])

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-[#0f172a] transition-colors duration-500">
        <Header onToggleFavorites={setShowFavorites} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        {/* Hero Section with Simplified Animations */}
        <div className="relative overflow-hidden">
          {/* Background gradient */}
          <div
            className={`absolute inset-0 ${
              darkMode
                ? "bg-gradient-to-r from-violet-600 to-indigo-800 opacity-80"
                : "bg-gradient-to-r from-blue-400 to-blue-600 opacity-70"
            } transition-colors duration-500`}
          />

          {/* Simplified Flag Animations - just a few floating flags */}
          <div className="absolute inset-0 overflow-hidden">
            {popularFlags.map((flag, index) => (
              <motion.div
                key={index}
                className="absolute rounded-lg overflow-hidden shadow-lg"
                style={{
                  width: 100,
                  height: 60,
                  left: `${15 + index * 20}%`,
                  top: `${30 + (index % 3) * 15}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.7, 0.9, 0.7],
                }}
                transition={{
                  duration: 3 + index,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <img src={flag || "/placeholder.svg"} alt="Country flag" className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>

          {/* Simple Globe */}
          <motion.div
            className="absolute right-10 top-20 md:right-20 md:top-40 z-10 hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="relative w-40 h-40">
              <div className={`absolute inset-0 rounded-full ${darkMode ? "bg-indigo-900/30" : "bg-blue-500/20"}`} />
              <div className="absolute inset-0 rounded-full border-2 border-blue-300/30 dark:border-indigo-300/30" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-400/40 dark:border-indigo-400/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FaCompass className="text-blue-500 dark:text-indigo-400 text-2xl" />
              </div>
            </div>
          </motion.div>

          {/* Hero Content */}
          <div className="relative py-28 mb-10 z-10">
            <div className="max-w-6xl mx-auto px-6">
              <motion.h1
                className="text-5xl md:text-6xl font-extrabold mb-5 tracking-tight text-white drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Explore Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                  World
                </span>
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl max-w-3xl text-white leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Discover details about countries around the globe, from population and languages to currencies and time
                zones.
              </motion.p>

              <motion.div
                className="mt-8 flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <a
                  href="#country-list"
                  className="px-6 py-3 bg-white text-blue-600 dark:text-indigo-700 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  <span className="flex items-center">
                    <FaSearch className="mr-2" />
                    Explore Countries
                  </span>
                </a>
                <button
                  onClick={() => setShowFavorites(!showFavorites)}
                  className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-600 dark:hover:text-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  {showFavorites ? "Show All Countries" : "View Favorites"}
                </button>
              </motion.div>
            </div>
          </div>

          {/* Simple Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
              <path
                fill={darkMode ? "#0f172a" : "#ffffff"}
                fillOpacity="1"
                d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              />
            </svg>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-12 relative z-10">
          {/* Stats Banner - simplified */}
          <motion.div
            className="flex flex-wrap justify-around items-center mb-10 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl dark:shadow-indigo-900/20 transition-colors duration-300 border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {[
              {
                label: "Countries",
                value: countries.length,
                icon: <FaGlobe className="w-6 h-6 text-blue-500 dark:text-indigo-500" />,
                description: "Explore countries worldwide",
              },
              {
                label: "Regions",
                value: topRegions.length,
                icon: <FaMapMarkerAlt className="w-6 h-6 text-green-500 dark:text-emerald-500" />,
                description: "Discover diverse regions",
              },
              {
                label: "Languages",
                value: topLanguages.length,
                icon: <FaLanguage className="w-6 h-6 text-purple-500 dark:text-violet-500" />,
                description: "Learn about global languages",
              },
              {
                label: showFavorites ? "Favorites" : "Save Favorites",
                value: showFavorites
                  ? (() => {
                      try {
                        const username = localStorage.getItem("user")
                        const allUsers = JSON.parse(localStorage.getItem("users")) || {}
                        return allUsers[username]?.favorites?.length || 0
                      } catch (error) {
                        console.error("Error getting favorites count:", error)
                        return 0
                      }
                    })()
                  : "❤️",
                icon: <div className="text-red-500">❤️</div>,
                description: "Track your favorite countries",
              },
            ].map(({ label, value, icon, description }) => (
              <div
                key={label}
                className="text-center p-4 flex flex-col items-center group hover:scale-105 transition-transform duration-200"
              >
                <div className="mb-2 p-3 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors duration-300">
                  {icon}
                </div>
                <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
                <p className="text-gray-600 dark:text-gray-300 font-medium">{label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {description}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Search Section */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl dark:shadow-indigo-900/20 transition-colors duration-300 mb-10 border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-gray-200">Find Your Country</h2>
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
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-200">
                {showFavorites ? "Your Favorite Countries" : "Countries"}
              </h2>
              <span className="text-sm font-medium px-4 py-2 bg-blue-100 dark:bg-indigo-900/30 text-blue-700 dark:text-indigo-300 rounded-full">
                {filteredCountries.length} results
              </span>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="relative w-24 h-24">
                  <div className="absolute top-0 left-0 w-full h-full border-8 border-blue-200 dark:border-indigo-900/30 rounded-full"></div>
                  <motion.div
                    className="absolute top-0 left-0 w-full h-full border-8 border-transparent border-t-blue-600 dark:border-t-indigo-400 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  ></motion.div>
                </div>
              </div>
            ) : (
              <div id="country-list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <motion.div
                      key={country.cca3}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CountryCard country={country} />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center col-span-full py-16 text-gray-600 dark:text-gray-400 select-none">
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
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer - simplified */}
        <footer
          className={`relative ${darkMode ? "bg-gray-900" : "bg-gray-100"} text-gray-600 dark:text-gray-300 py-12 mt-16 shadow-inner transition-colors duration-500`}
        >
          <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
            <div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? "text-indigo-400" : "text-blue-600"}`}>
                Country Book
              </h3>
              <p className="mb-6 text-gray-500 dark:text-gray-400">
                Explore our beautiful world, one country at a time.
              </p>
              <div className="flex justify-center space-x-6 mb-8">
                {["Facebook", "Twitter", "Instagram", "GitHub"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors duration-300"
                  >
                    {social}
                  </a>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Country Book | All rights reserved
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Home
