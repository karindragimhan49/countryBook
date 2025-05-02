"use client"
import { motion } from "framer-motion"
import { FaFilter, FaGlobe, FaLanguage } from "react-icons/fa"

function FilterBar({ onRegionChange, onLanguageChange, regions, languages }) {
  return (
    <div className="my-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <FaGlobe className="w-4 h-4 mr-2 text-blue-600 dark:text-indigo-500" />
            Filter by Region
          </label>
          <motion.select
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-indigo-500/30 focus:border-blue-500 dark:focus:border-indigo-500"
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <option value="">All Regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </motion.select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <FaLanguage className="w-4 h-4 mr-2 text-blue-600 dark:text-indigo-500" />
            Filter by Language
          </label>
          <motion.select
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-indigo-500/30 focus:border-blue-500 dark:focus:border-indigo-500"
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <option value="">All Languages</option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </motion.select>
        </div>
      </div>

      <motion.div
        className="mt-4 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-indigo-900/20 text-blue-700 dark:text-indigo-300 rounded-full text-sm">
          <FaFilter className="w-4 h-4" />
          <span>Use filters to narrow your search</span>
        </div>
      </motion.div>
    </div>
  )
}

export default FilterBar
