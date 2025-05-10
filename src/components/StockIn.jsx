"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaPlus } from "react-icons/fa"
import AutoSuggest from "./AutoSuggest"
import { API_URL } from "../api/api"

function StockIn() {
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    location: "",
  })
  const [suggestions, setSuggestions] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    // Fetch existing inventory items for auto-suggest
    const fetchInventoryItems = async () => {
      try {
        const response = await fetch(`${API_URL}/api/inventory`)
        const data = await response.json()
        if (data.success) {
          setSuggestions(data.items.map((item) => item.name))
        }
      } catch (error) {
        console.error("Error fetching inventory items:", error)
      }
    }

    fetchInventoryItems()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSuggestionSelect = (suggestion) => {
    setFormData((prev) => ({ ...prev, itemName: suggestion }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/api/stock/in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage(`Successfully added ${formData.quantity} units of ${formData.itemName} to inventory.`)
        setFormData({
          itemName: "",
          quantity: "",
          location: "",
        })

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("")
        }, 3000)
      }
    } catch (error) {
      console.error("Error adding stock:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <h2 className="text-xl font-semibold mb-6">Stock In - Add Inventory</h2>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
        >
          {successMessage}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
            Item Name
          </label>
          <div className="relative">
            <AutoSuggest
              value={formData.itemName}
              onChange={handleChange}
              onSelect={handleSuggestionSelect}
              suggestions={suggestions}
              name="itemName"
              placeholder="Enter item name"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter quantity"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter storage location"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          <FaPlus className="mr-2" />
          {isSubmitting ? "Adding..." : "Add to Inventory"}
        </button>
      </form>
    </motion.div>
  )
}

export default StockIn
