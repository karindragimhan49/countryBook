"use client"

import { useParams, Link } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { getCountryByCode } from "../services/api"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { motion } from "framer-motion"
import "react-clock/dist/Clock.css"
import "leaflet/dist/leaflet.css"
import {
  FaGlobe,
  FaMapMarkerAlt,
  FaUsers,
  FaLanguage,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaHeart,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaImages,
  FaChartBar,
  FaHistory,
  FaLandmark,
} from "react-icons/fa"

// Country descriptions for the "About" section
const countryDescriptions = {
  // Default description if country-specific one isn't found
  default:
    "This beautiful country has a rich history and culture, with diverse landscapes and friendly people. Visitors can experience unique traditions, taste delicious local cuisine, and explore breathtaking natural wonders.",

  // Some specific country descriptions
  USA: "The United States of America is a diverse nation known for its iconic landmarks like the Statue of Liberty and Grand Canyon. With 50 states spanning a vast continent, it offers everything from bustling metropolises to pristine wilderness.",
  GBR: "The United Kingdom, comprising England, Scotland, Wales, and Northern Ireland, is rich in history and culture. From the historic streets of London to the Scottish Highlands, it offers stunning landscapes, royal heritage, and world-class museums.",
  FRA: "France, known for its art, cuisine, and fashion, is one of the world's most visited countries. Home to iconic landmarks like the Eiffel Tower and Louvre Museum, it offers beautiful countryside, alpine mountains, and Mediterranean beaches.",
  DEU: "Germany combines rich history with modern innovation. Known for its precision engineering, fairy-tale castles, and vibrant cities like Berlin and Munich, it offers beautiful forests, river valleys, and a strong cultural heritage.",
  JPN: "Japan blends ancient traditions with cutting-edge technology. From cherry blossoms and historic temples to neon-lit Tokyo, it offers unique cultural experiences, exquisite cuisine, and natural beauty from snow-capped mountains to tropical islands.",
  AUS: "Australia, the world's smallest continent but sixth-largest country, is known for its natural wonders and laid-back lifestyle. Home to unique wildlife, stunning beaches, the vast Outback, and vibrant cities like Sydney and Melbourne.",
  CAN: "Canada, the world's second-largest country, is known for its stunning natural landscapes, from the Rocky Mountains to the Northern Lights. With diverse, multicultural cities and vast wilderness, it offers adventure and warm hospitality.",
  IND: "India is a vibrant tapestry of cultures, languages, and traditions. Home to ancient civilizations and architectural marvels like the Taj Mahal, it offers spiritual experiences, colorful festivals, diverse cuisines, and breathtaking landscapes.",
  BRA: "Brazil, South America's largest country, is known for its Amazon rainforest, vibrant Carnival celebrations, and beautiful beaches. With diverse ecosystems, lively music, and rich cultural heritage, it offers unforgettable experiences.",
  ZAF: "South Africa, known as the 'Rainbow Nation,' offers incredible diversity in landscapes, wildlife, and cultures. From safari adventures to vibrant cities, it features stunning coastlines, majestic mountains, and a rich historical heritage.",
}

// Sample country images (in a real app, these would come from an API)
const getCountryImages = (countryCode) => {
  const defaultImages = [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ]

  // In a real app, you would have actual country images here
  const countrySpecificImages = {
    USA: [
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
      "https://images.unsplash.com/photo-1534430480872-3498386e7856",
      "https://images.unsplash.com/photo-1575408264798-b50b252663e6",
    ],
    // Add more countries as needed
  }

  return countrySpecificImages[countryCode] || defaultImages
}

function CountryDetail() {
  const { code } = useParams()
  const [country, setCountry] = useState(null)
  const [user, setUser] = useState(null)
  const [localTime, setLocalTime] = useState(new Date())
  const [countryTime, setCountryTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [countryImages, setCountryImages] = useState([])
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [darkMode, setDarkMode] = useState(false)
  const mapRef = useRef(null)

  // Check dark mode from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = localStorage.getItem("darkMode") === "true"
      setDarkMode(isDark)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await getCountryByCode(code)
        setCountry(res[0]) // API returns an array

        // Set country images
        setCountryImages(getCountryImages(code))

        // Check if country is in favorites
        const username = localStorage.getItem("user")
        if (username) {
          const allUsers = JSON.parse(localStorage.getItem("users")) || {}
          const user = allUsers[username]
          setUser(user)
          setIsFavorite(user?.favorites?.includes(code) || false)
        }
      } catch (err) {
        console.error("Error loading country:", err)
      } finally {
        // Add a slight delay for smoother loading animation
        setTimeout(() => setLoading(false), 800)
      }
    }
    fetchData()
  }, [code])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setLocalTime(now)

      if (country?.timezones?.[0]) {
        try {
          const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: country.timezones[0].replace("UTC", "Etc/GMT"),
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
          })
          const parts = formatter.formatToParts(now)
          const hours = parts.find((part) => part.type === "hour")?.value
          const minutes = parts.find((part) => part.type === "minute")?.value
          const seconds = parts.find((part) => part.type === "second")?.value
          setCountryTime(new Date(now.setHours(hours, minutes, seconds)))
        } catch (e) {
          console.error("Error setting country time:", e)
          setCountryTime(now)
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [country])

  const formatTimeDigital = (date) => {
    return {
      time: new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(date),
      date: new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date),
    }
  }

  const handleFavoriteToggle = () => {
    const username = localStorage.getItem("user")
    if (!username) return

    const allUsers = JSON.parse(localStorage.getItem("users")) || {}
    const user = allUsers[username]

    if (isFavorite) {
      user.favorites = user.favorites.filter((c) => c !== code)
    } else {
      if (!user.favorites) user.favorites = []
      user.favorites.push(code)
    }

    allUsers[username] = user
    localStorage.setItem("users", JSON.stringify(allUsers))
    setUser(user)
    setIsFavorite(!isFavorite)
  }

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num?.toLocaleString() || "N/A"
  }

  // Get country description
  const getCountryDescription = (countryCode) => {
    return countryDescriptions[countryCode] || countryDescriptions.default
  }

  // Custom tab component
  const TabNavigation = ({ tabs, activeTab, onChange }) => {
    return (
      <div className={`flex p-1 gap-1 bg-gray-100 dark:bg-gray-700 p-2`}>
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === idx
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/[0.12] dark:hover:bg-gray-600"
            }`}
            onClick={() => onChange(idx)}
          >
            <div className="flex items-center justify-center">
              {tab.icon}
              {tab.label}
            </div>
          </button>
        ))}
      </div>
    )
  }

  // Loading skeleton
  if (loading) {
    return (
      <div
        className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} transition-colors duration-300`}
      >
        <div className="max-w-6xl mx-auto p-6">
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-8"></div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 animate-pulse">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-3/4 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!country) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} transition-colors duration-300`}
      >
        <motion.div
          className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaInfoCircle className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Country Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">We couldn't find information for this country.</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 dark:bg-indigo-600 text-white font-medium rounded-full hover:bg-blue-700 dark:hover:bg-indigo-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Return Home
          </Link>
        </motion.div>
      </div>
    )
  }

  // Get currencies as an array of objects
  const currencies = Object.entries(country.currencies || {}).map(([code, currency]) => ({
    code,
    name: currency.name,
    symbol: currency.symbol,
  }))

  // Get languages as an array
  const languages = Object.entries(country.languages || {}).map(([code, name]) => ({
    code,
    name,
  }))

  // Get borders as an array
  const borders = country.borders || []

  // Define tabs
  const tabs = [
    {
      label: "Overview",
      icon: <FaInfoCircle className={`mr-2 ${activeTab === 0 ? "text-blue-600 dark:text-indigo-400" : ""}`} />,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FaHistory className="mr-2 text-blue-600 dark:text-indigo-400" />
                About {country.name.common}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {getCountryDescription(country.cca3)}
              </p>

              {country.capitalInfo?.latlng && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <FaMapMarkerAlt className="mr-2 text-blue-600 dark:text-indigo-400" />
                  Capital coordinates: {country.capitalInfo.latlng[0].toFixed(2)}°,{" "}
                  {country.capitalInfo.latlng[1].toFixed(2)}°
                </div>
              )}

              {/* Borders */}
              {borders.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <FaGlobe className="mr-2 text-blue-600 dark:text-indigo-400" />
                    Bordering Countries
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {borders.map((border) => (
                      <Link
                        key={border}
                        to={`/country/${border}`}
                        className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                          darkMode
                            ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                        }`}
                      >
                        {border}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Key Facts */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FaLandmark className="mr-2 text-blue-600 dark:text-indigo-400" />
                Key Facts
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Languages */}
                <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <FaLanguage className="mr-2 text-blue-600 dark:text-indigo-400" />
                    Languages
                  </h3>
                  <ul className="space-y-2">
                    {languages.length > 0 ? (
                      languages.map((lang) => (
                        <li key={lang.code} className="flex items-center">
                          <span className="w-16 text-sm text-gray-500 dark:text-gray-400">{lang.code}:</span>
                          <span className="font-medium">{lang.name}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 dark:text-gray-400">No language data available</li>
                    )}
                  </ul>
                </div>

                {/* Currencies */}
                <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <FaMoneyBillWave className="mr-2 text-blue-600 dark:text-indigo-400" />
                    Currencies
                  </h3>
                  <ul className="space-y-2">
                    {currencies.length > 0 ? (
                      currencies.map((currency) => (
                        <li key={currency.code} className="flex items-center">
                          <span className="w-16 text-sm text-gray-500 dark:text-gray-400">{currency.code}:</span>
                          <span className="font-medium">
                            {currency.name} {currency.symbol && `(${currency.symbol})`}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 dark:text-gray-400">No currency data available</li>
                    )}
                  </ul>
                </div>

                {/* Timezones */}
                <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-600 dark:text-indigo-400" />
                    Timezones
                  </h3>
                  <div className="max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                    <ul className="space-y-1">
                      {country.timezones.map((timezone, index) => (
                        <li key={index} className="text-sm">
                          {timezone}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Additional Info */}
                <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <FaInfoCircle className="mr-2 text-blue-600 dark:text-indigo-400" />
                    Additional Info
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Independent:</span>
                      <span className="font-medium">{country.independent ? "Yes" : "No"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">UN Member:</span>
                      <span className="font-medium">{country.unMember ? "Yes" : "No"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Driving Side:</span>
                      <span className="font-medium capitalize">{country.car?.side || "N/A"}</span>
                    </li>
                    {country.startOfWeek && (
                      <li className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Start of Week:</span>
                        <span className="font-medium capitalize">{country.startOfWeek}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Time and Weather Section */}
          <div>
            {/* Current Time */}
            <div className={`mb-6 p-6 rounded-xl ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-600 dark:text-indigo-400" />
                Current Local Time
              </h3>

              <div className="text-center">
                <div
                  className={`text-4xl font-mono font-bold mb-2 p-4 rounded-lg ${
                    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800 shadow-inner"
                  }`}
                >
                  {formatTimeDigital(countryTime).time}
                  <span className="inline-block ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </div>
                <div className="text-gray-600 dark:text-gray-300 mt-2">{formatTimeDigital(countryTime).date}</div>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Timezone: {country.timezones[0]}</div>
              </div>
            </div>

            {/* Coat of Arms */}
            {country.coatOfArms?.svg && (
              <div className={`p-6 rounded-xl mb-6 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                <h3 className="text-lg font-semibold mb-4">Coat of Arms</h3>
                <div className="flex justify-center">
                  <img
                    src={country.coatOfArms.svg || "/placeholder.svg"}
                    alt={`Coat of Arms of ${country.name.common}`}
                    className="max-h-48"
                  />
                </div>
              </div>
            )}

            {/* External Links */}
            <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaExternalLinkAlt className="mr-2 text-blue-600 dark:text-indigo-400" />
                External Resources
              </h3>
              <div className="space-y-3">
                {country.maps?.googleMaps && (
                  <a
                    href={country.maps.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      darkMode
                        ? "bg-gray-600 hover:bg-gray-500 text-white"
                        : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
                    }`}
                  >
                    <FaMapMarkerAlt className="mr-3 text-red-500" />
                    <span>View on Google Maps</span>
                  </a>
                )}
                {country.maps?.openStreetMaps && (
                  <a
                    href={country.maps.openStreetMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      darkMode
                        ? "bg-gray-600 hover:bg-gray-500 text-white"
                        : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
                    }`}
                  >
                    <FaMapMarkerAlt className="mr-3 text-blue-500" />
                    <span>View on OpenStreetMap</span>
                  </a>
                )}
                <a
                  href={`https://en.wikipedia.org/wiki/${encodeURIComponent(country.name.common)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    darkMode
                      ? "bg-gray-600 hover:bg-gray-500 text-white"
                      : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
                  }`}
                >
                  <FaInfoCircle className="mr-3 text-blue-500" />
                  <span>Wikipedia</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Gallery",
      icon: <FaImages className={`mr-2 ${activeTab === 1 ? "text-blue-600 dark:text-indigo-400" : ""}`} />,
      content: (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FaImages className="mr-2 text-blue-600 dark:text-indigo-400" />
              {country.name.common} Gallery
            </h2>

            {/* Featured Image */}
            <div className="mb-6">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                <img
                  src={countryImages[activeImageIndex] || "/placeholder.svg"}
                  alt={`${country.name.common} landscape`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 shadow-inner"></div>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-4">
              {countryImages.map((image, index) => (
                <motion.button
                  key={index}
                  className={`relative aspect-[4/3] overflow-hidden rounded-lg ${
                    activeImageIndex === index ? "ring-4 ring-blue-500 dark:ring-indigo-500" : ""
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${country.name.common} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">About the Images</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              These images showcase the beautiful landscapes, landmarks, and cultural elements of {country.name.common}.
              From natural wonders to urban scenes, they represent the diverse beauty of this country.
            </p>
            <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Note: Images are representative and may be sourced from various photographers. All rights belong to
                their respective owners.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Map",
      icon: <FaMapMarkerAlt className={`mr-2 ${activeTab === 2 ? "text-blue-600 dark:text-indigo-400" : ""}`} />,
      content: (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-blue-600 dark:text-indigo-400" />
              {country.name.common} on Map
            </h2>

            <div className="h-[500px] rounded-xl overflow-hidden shadow-lg">
              {country.latlng && (
                <MapContainer center={country.latlng} zoom={4} style={{ height: "100%", width: "100%" }} ref={mapRef}>
                  <TileLayer
                    url={
                      darkMode
                        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    }
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={country.latlng}>
                    <Popup>
                      <div className="text-center">
                        <img
                          src={country.flags.png || "/placeholder.svg"}
                          alt={`Flag of ${country.name.common}`}
                          className="w-16 mx-auto mb-2"
                        />
                        <div className="font-bold">{country.name.common}</div>
                        <div className="text-sm text-gray-600">{country.capital?.[0] || "No capital data"}</div>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Coordinates */}
            <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <h3 className="text-lg font-semibold mb-3">Geographic Coordinates</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Country Center:</span>
                  <span className="font-mono bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">
                    {country.latlng?.[0].toFixed(4)}°, {country.latlng?.[1].toFixed(4)}°
                  </span>
                </div>

                {country.capitalInfo?.latlng && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Capital:</span>
                    <span className="font-mono bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">
                      {country.capitalInfo.latlng[0].toFixed(4)}°, {country.capitalInfo.latlng[1].toFixed(4)}°
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Continent:</span>
                  <span className="font-medium">{country.continents?.join(", ")}</span>
                </div>
              </div>
            </div>

            {/* Borders */}
            <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <h3 className="text-lg font-semibold mb-3">Bordering Countries</h3>
              {borders.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {borders.map((border) => (
                    <Link
                      key={border}
                      to={`/country/${border}`}
                      className={`px-4 py-2 text-center rounded-lg transition-colors ${
                        darkMode
                          ? "bg-gray-600 hover:bg-gray-500 text-white"
                          : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
                      }`}
                    >
                      {border}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  {country.name.common} is an island nation or has no bordering countries.
                </p>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Details",
      icon: <FaChartBar className={`mr-2 ${activeTab === 3 ? "text-blue-600 dark:text-indigo-400" : ""}`} />,
      content: (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaChartBar className="mr-2 text-blue-600 dark:text-indigo-400" />
            Detailed Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-3 text-gray-600 dark:text-gray-400">Common Name</td>
                    <td className="py-3 font-medium text-right">{country.name.common}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-3 text-gray-600 dark:text-gray-400">Official Name</td>
                    <td className="py-3 font-medium text-right">{country.name.official}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-3 text-gray-600 dark:text-gray-400">Capital</td>
                    <td className="py-3 font-medium text-right">{country.capital?.[0] || "N/A"}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-3 text-gray-600 dark:text-gray-400">Region</td>
                    <td className="py-3 font-medium text-right">{country.region}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-3 text-gray-600 dark:text-gray-400">Subregion</td>
                    <td className="py-3 font-medium text-right">{country.subregion || "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400">Population</td>
                    <td className="py-3 font-medium text-right">{formatNumber(country.population)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Geography */}
            <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <h3 className="text-lg font-semibold mb-4">Geography</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-3 text-gray-600 dark:text-gray-400">Area</td>
                    <td className="py-3 font-medium text-right">{formatNumber(country.area)} km²</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-3 text-gray-600 dark:text-gray-400">Continent</td>
                    <td className="py-3 font-medium text-right">{country.continents?.join(", ")}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-3 text-gray-600 dark:text-gray-400">Borders</td>
                    <td className="py-3 font-medium text-right">{borders.length || 0} countries</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-3 text-gray-600 dark:text-gray-400">Latitude</td>
                    <td className="py-3 font-medium text-right">{country.latlng?.[0].toFixed(2)}°</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400">Longitude</td>
                    <td className="py-3 font-medium text-right">{country.latlng?.[1].toFixed(2)}°</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Codes and IDs */}
            <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <h3 className="text-lg font-semibold mb-4">Codes and Identifiers</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-3 text-gray-600 dark:text-gray-400">ISO 3166-1 alpha-2</td>
                    <td className="py-3 font-medium text-right">{country.cca2}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-3 text-gray-600 dark:text-gray-400">ISO 3166-1 alpha-3</td>
                    <td className="py-3 font-medium text-right">{country.cca3}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-3 text-gray-600 dark:text-gray-400">ISO 3166-1 numeric</td>
                    <td className="py-3 font-medium text-right">{country.ccn3 || "N/A"}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-3 text-gray-600 dark:text-gray-400">International calling code</td>
                    <td className="py-3 font-medium text-right">
                      {country.idd?.root}
                      {country.idd?.suffixes?.[0] || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400">Top-level domain</td>
                    <td className="py-3 font-medium text-right">{country.tld?.[0] || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Miscellaneous */}
            <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <h3 className="text-lg font-semibold mb-4">Miscellaneous</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-3 text-gray-600 dark:text-gray-400">Independent</td>
                    <td className="py-3 font-medium text-right">{country.independent ? "Yes" : "No"}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-3 text-gray-600 dark:text-gray-400">UN Member</td>
                    <td className="py-3 font-medium text-right">{country.unMember ? "Yes" : "No"}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-3 text-gray-600 dark:text-gray-400">Driving side</td>
                    <td className="py-3 font-medium text-right capitalize">{country.car?.side || "N/A"}</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-3 text-gray-600 dark:text-gray-400">Start of week</td>
                    <td className="py-3 font-medium text-right capitalize">{country.startOfWeek || "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400">FIFA code</td>
                    <td className="py-3 font-medium text-right">{country.fifa || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} transition-colors duration-300`}
    >
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Back button and favorite toggle */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/"
            className={`inline-flex items-center px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
              darkMode
                ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                : "bg-white text-gray-800 shadow-md hover:shadow-lg"
            }`}
          >
            <FaArrowLeft className="mr-2" /> Back to Countries
          </Link>

          <motion.button
            onClick={handleFavoriteToggle}
            className={`p-3 rounded-full transition-all duration-300 ${
              isFavorite
                ? "bg-red-100 dark:bg-red-900/30 text-red-500"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <FaHeart className="text-xl" />
          </motion.button>
        </div>

        {/* Hero section with flag and name */}
        <motion.div
          className={`relative overflow-hidden rounded-2xl mb-8 ${
            darkMode ? "bg-gradient-to-r from-indigo-900 to-purple-900" : "bg-gradient-to-r from-blue-500 to-blue-700"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-10"></div>

          <div className="relative z-10 p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8">
            <motion.div
              className="w-full md:w-1/3 flex-shrink-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative aspect-[3/2] overflow-hidden rounded-xl shadow-2xl">
                <img
                  src={country.flags.svg || country.flags.png}
                  alt={`Flag of ${country.name.common}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 shadow-inner border border-white/10 rounded-xl"></div>
              </div>
            </motion.div>

            <div className="w-full md:w-2/3 text-white">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  {country.region}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  {country.subregion}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  {country.cca3}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold mb-2 tracking-tight">{country.name.common}</h1>
              <p className="text-xl text-white/80 mb-4">{country.name.official}</p>

              <div className="flex flex-wrap gap-6 text-white/90">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>
                    Capital: <strong>{country.capital?.[0] || "N/A"}</strong>
                  </span>
                </div>
                <div className="flex items-center">
                  <FaUsers className="mr-2" />
                  <span>
                    Population: <strong>{formatNumber(country.population)}</strong>
                  </span>
                </div>
                <div className="flex items-center">
                  <FaGlobe className="mr-2" />
                  <span>
                    Area: <strong>{formatNumber(country.area)} km²</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main content tabs */}
        <motion.div
          className={`rounded-2xl overflow-hidden shadow-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <TabNavigation tabs={tabs} activeTab={activeTab} onChange={(index) => setActiveTab(index)} />

          <div className="p-6">{tabs[activeTab].content}</div>
        </motion.div>
      </div>
    </div>
  )
}

export default CountryDetail
