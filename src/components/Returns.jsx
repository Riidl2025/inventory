"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaUndo, FaSearch, FaExclamationCircle, FaInfoCircle } from "react-icons/fa"
import { API_URL } from "../api/api"

function Returns() {
  const [pendingReturns, setPendingReturns] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [returnData, setReturnData] = useState({
    transactionId: "",
    returnQuantity: "",
    location: "",
    returnDate: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    fetchPendingReturns()
  }, [])

  const fetchPendingReturns = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log("Fetching pending returns from:", `${API_URL}/api/return/pending`)
      const response = await fetch(`${API_URL}/api/return/pending`)

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setPendingReturns(data.pendingItems || [])
      } else {
        setError(data.message || "Failed to fetch pending returns")
      }
    } catch (error) {
      console.error("Error fetching pending returns:", error)
      setError(`Error: ${error.message}. Please check that the backend server is running.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectTransaction = (transaction) => {
    setSelectedTransaction(transaction)
    setReturnData({
      transactionId: transaction._id,
      returnQuantity: transaction.quantity,
      location: "",
      returnDate: new Date().toISOString().split("T")[0],
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setReturnData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const response = await fetch(`${API_URL}/api/return`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(returnData),
      })

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setSuccessMessage(
          `Successfully processed return of ${returnData.returnQuantity} units of ${selectedTransaction.itemName}`,
        )
        setSelectedTransaction(null)
        setReturnData({
          transactionId: "",
          returnQuantity: "",
          location: "",
          returnDate: new Date().toISOString().split("T")[0],
        })
        // Refresh the pending returns list
        fetchPendingReturns()

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("")
        }, 3000)
      } else {
        setErrorMessage(data.message || "Failed to process return. Please try again.")
      }
    } catch (error) {
      console.error("Error processing return:", error)
      setErrorMessage(`Error: ${error.message}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <h3 className="font-bold mb-2 flex items-center">
          <FaExclamationCircle className="mr-2" /> Error Loading Returns
        </h3>
        <p>{error}</p>
        <div className="mt-4 p-4 bg-gray-100 rounded text-gray-800 text-sm">
          <p className="font-semibold">Troubleshooting Steps:</p>
          <ol className="list-decimal ml-5 mt-2 space-y-1">
            <li>Check that your backend server is running on port 5000</li>
            <li>Verify that MongoDB is connected properly</li>
            <li>Check that the API URL is correct in your frontend config</li>
            <li>Look for any CORS errors in the browser console</li>
          </ol>
          <button
            onClick={fetchPendingReturns}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <h2 className="text-xl font-semibold mb-2">Process Returns</h2>

      <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
        <FaInfoCircle className="text-blue-500 mr-2 mt-1 flex-shrink-0" />
        <div>
          <p className="text-sm text-blue-800">
            <strong>Important:</strong> When processing returns, the items will be added back to your current stock
            without increasing the "Stock In" count. This ensures your inventory tracking remains accurate for auditing
            purposes.
          </p>
        </div>
      </div>

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

      {selectedTransaction ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-blue-800">Processing Return</h3>
            <p className="text-sm text-blue-600">
              Item: <span className="font-semibold">{selectedTransaction.itemName}</span>
            </p>
            <p className="text-sm text-blue-600">
              Issued To: <span className="font-semibold">{selectedTransaction.issuedTo}</span>
            </p>
            <p className="text-sm text-blue-600">
              Original Quantity: <span className="font-semibold">{selectedTransaction.quantity}</span>
            </p>
            <p className="text-sm text-blue-600">
              Issue Date:{" "}
              <span className="font-semibold">{new Date(selectedTransaction.date).toLocaleDateString()}</span>
            </p>
          </div>

          <div>
            <label htmlFor="returnQuantity" className="block text-sm font-medium text-gray-700 mb-1">
              Return Quantity
            </label>
            <input
              type="number"
              id="returnQuantity"
              name="returnQuantity"
              value={returnData.returnQuantity}
              onChange={handleChange}
              min="1"
              max={selectedTransaction.quantity}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter return quantity"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Return Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={returnData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter return location"
            />
          </div>

          <div>
            <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
              Return Date
            </label>
            <input
              type="date"
              id="returnDate"
              name="returnDate"
              value={returnData.returnDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FaUndo className="mr-2" />
              Process Return
            </button>
            <button
              type="button"
              onClick={() => setSelectedTransaction(null)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by item name or student name"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  // Simple client-side filtering
                  const searchTerm = e.target.value.toLowerCase()
                  if (searchTerm === "") {
                    fetchPendingReturns()
                  } else {
                    const filtered = pendingReturns.filter(
                      (item) =>
                        item.itemName.toLowerCase().includes(searchTerm) ||
                        item.issuedTo.toLowerCase().includes(searchTerm),
                    )
                    setPendingReturns(filtered)
                  }
                }}
              />
            </div>
          </div>

          {pendingReturns.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No pending returnable items found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Item Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Issued To
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Issue Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingReturns.map((transaction, index) => (
                    <tr key={transaction._id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.itemName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.issuedTo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleSelectTransaction(transaction)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Process Return
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default Returns
