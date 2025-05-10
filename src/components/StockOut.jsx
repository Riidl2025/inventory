"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaArrowRight } from "react-icons/fa"
import AutoSuggest from "./AutoSuggest"
import { API_URL } from "../api/api"

function StockOut() {
  const [formData, setFormData] = useState({
    itemName: "",
    issuedTo: "",
    quantity: "",
    issuedItemType: "returnable", // Default to returnable
    date: new Date().toISOString().split("T")[0], // Default to today
  })

  const [suggestions, setSuggestions] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

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
    setErrorMessage("")

    try {
      const response = await fetch(`${API_URL}/api/stock/out`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage(
          `Successfully issued ${formData.quantity} units of ${formData.itemName} to ${formData.issuedTo}.`,
        )
        setFormData({
          itemName: "",
          issuedTo: "",
          quantity: "",
          issuedItemType: "returnable",
          date: new Date().toISOString().split("T")[0],
        })

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("")
        }, 3000)
      } else {
        setErrorMessage(data.message || "Failed to issue stock. Please try again.")
      }
    } catch (error) {
      console.error("Error issuing stock:", error)
      setErrorMessage("An error occurred. Please try again.")
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
      <h2 className="text-xl font-semibold mb-6">Stock Out - Issue Inventory</h2>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
        >
          {successMessage}
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
        >
          {errorMessage}
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
          <label htmlFor="issuedTo" className="block text-sm font-medium text-gray-700 mb-1">
            Issued To (Student/Startup Name)
          </label>
          <input
            type="text"
            id="issuedTo"
            name="issuedTo"
            value={formData.issuedTo}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter recipient name"
          />
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
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="issuedItemType" className="block text-sm font-medium text-gray-700 mb-1">
            Issued Item Type
          </label>
          <select
            id="issuedItemType"
            name="issuedItemType"
            value={formData.issuedItemType}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="returnable">Returnable</option>
            <option value="nonReturnable">Non-Returnable</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
            isSubmitting ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          <FaArrowRight className="mr-2" />
          {isSubmitting ? "Processing..." : "Issue Item"}
        </button>
      </form>
    </motion.div>
  )
}

export default StockOut
