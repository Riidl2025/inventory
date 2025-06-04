// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import { FaBoxes, FaArrowUp, FaArrowDown, FaExclamationTriangle, FaUndo } from "react-icons/fa"
// import { API_URL } from "../api/api"

// function Dashboard() {
//   const [inventoryData, setInventoryData] = useState([])
//   const [pendingReturns, setPendingReturns] = useState([])
//   const [returnTransactions, setReturnTransactions] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setIsLoading(true)
//         setError(null)

//         console.log("Fetching dashboard data from:", `${API_URL}/api/dashboard`)

//         // Fetch inventory data
//         const inventoryResponse = await fetch(`${API_URL}/api/dashboard`)

//         if (!inventoryResponse.ok) {
//           throw new Error(`Dashboard API returned ${inventoryResponse.status}: ${inventoryResponse.statusText}`)
//         }

//         const inventoryData = await inventoryResponse.json()

//         // Only fetch other data if inventory fetch was successful
//         if (inventoryData.success) {
//           setInventoryData(inventoryData.inventory)

//           try {
//             // Fetch pending returns
//             console.log("Fetching pending returns from:", `${API_URL}/api/return/pending`)
//             const returnsResponse = await fetch(`${API_URL}/api/return/pending`)

//             if (!returnsResponse.ok) {
//               console.warn(`Returns API returned ${returnsResponse.status}: ${returnsResponse.statusText}`)
//               setPendingReturns([])
//             } else {
//               const returnsData = await returnsResponse.json()
//               if (returnsData.success) {
//                 setPendingReturns(returnsData.pendingItems || [])
//               } else {
//                 console.warn("Returns API returned success: false")
//                 setPendingReturns([])
//               }
//             }

//             // Fetch return transactions
//             console.log("Fetching return history from:", `${API_URL}/api/return/history`)
//             const returnHistoryResponse = await fetch(`${API_URL}/api/return/history`)

//             if (!returnHistoryResponse.ok) {
//               console.warn(
//                 `Return history API returned ${returnHistoryResponse.status}: ${returnHistoryResponse.statusText}`,
//               )
//               setReturnTransactions([])
//             } else {
//               const returnHistoryData = await returnHistoryResponse.json()
//               if (returnHistoryData.success) {
//                 setReturnTransactions(returnHistoryData.returns || [])
//               } else {
//                 console.warn("Return history API returned success: false")
//                 setReturnTransactions([])
//               }
//             }
//           } catch (dataError) {
//             console.error("Error fetching additional data:", dataError)
//             // Don't fail the whole dashboard if just some data fails
//           }
//         } else {
//           setError(inventoryData.message || "Failed to fetch inventory data")
//         }
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error)
//         setError(`Error: ${error.message}. Please check that the backend server is running.`)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchDashboardData()
//   }, [])

//   // Calculate pending returns by item
//   const getPendingReturnsByItem = (itemName) => {
//     return pendingReturns.filter((item) => item.itemName === itemName).reduce((total, item) => total + item.quantity, 0)
//   }

//   // Calculate returned items by item name
//   const getReturnedItemsByName = (itemName) => {
//     return returnTransactions
//       .filter((item) => item.itemName === itemName)
//       .reduce((total, item) => total + item.quantity, 0)
//   }

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//         <h3 className="font-bold mb-2">Error Loading Dashboard</h3>
//         <p>{error}</p>
//         <div className="mt-4 p-4 bg-gray-100 rounded text-gray-800 text-sm">
//           <p className="font-semibold">Troubleshooting Steps:</p>
//           <ol className="list-decimal ml-5 mt-2 space-y-1">
//             <li>Check that your backend server is running on port 5000</li>
//             <li>Verify that MongoDB is connected properly</li>
//             <li>Check that the API URL is correct in your frontend config</li>
//             <li>Look for any CORS errors in the browser console</li>
//           </ol>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
//       <div className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-6 flex items-center">
//           <FaBoxes className="mr-2 text-blue-500" /> Inventory Dashboard
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-blue-50 p-4 rounded-lg">
//             <h3 className="text-sm font-medium text-blue-800 mb-2">Total Items</h3>
//             <p className="text-2xl font-bold">{inventoryData.length}</p>
//           </div>

//           <div className="bg-green-50 p-4 rounded-lg">
//             <h3 className="text-sm font-medium text-green-800 mb-2">Total Stock In</h3>
//             <p className="text-2xl font-bold">{inventoryData.reduce((total, item) => total + item.stockIn, 0)}</p>
//           </div>

//           <div className="bg-red-50 p-4 rounded-lg">
//             <h3 className="text-sm font-medium text-red-800 mb-2">Total Stock Out</h3>
//             <p className="text-2xl font-bold">{inventoryData.reduce((total, item) => total + item.stockOut, 0)}</p>
//           </div>

//           <div className="bg-purple-50 p-4 rounded-lg">
//             <h3 className="text-sm font-medium text-purple-800 mb-2">Pending Returns</h3>
//             <p className="text-2xl font-bold">
//               {pendingReturns.reduce((total, item) => total + item.quantity, 0) || 0}
//             </p>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Item Name
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   <span className="flex items-center">
//                     <FaArrowUp className="text-green-500 mr-1" /> Stock In
//                   </span>
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   <span className="flex items-center">
//                     <FaArrowDown className="text-red-500 mr-1" /> Stock Out
//                   </span>
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   <span className="flex items-center">
//                     <FaUndo className="text-purple-500 mr-1" /> Returns
//                   </span>
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   <span className="flex items-center">
//                     <FaUndo className="text-purple-500 mr-1" /> Pending Returns
//                   </span>
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Current Stock
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Location
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {inventoryData.map((item, index) => {
//                 const pendingReturnsCount = getPendingReturnsByItem(item.name)
//                 const returnedItemsCount = getReturnedItemsByName(item.name)

//                 return (
//                   <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.stockIn}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.stockOut}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {returnedItemsCount > 0 ? (
//                         <span className="text-purple-600 font-medium">{returnedItemsCount}</span>
//                       ) : (
//                         "0"
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {pendingReturnsCount > 0 ? (
//                         <span className="text-purple-600 font-medium">{pendingReturnsCount}</span>
//                       ) : (
//                         "0"
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{item.totalStock}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {item.totalStock <= 3 ? (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 items-center">
//                           <FaExclamationTriangle className="mr-1" /> Low Stock
//                         </span>
//                       ) : (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                           In Stock
//                         </span>
//                       )}
//                     </td>
//                   </tr>
//                 )
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">Low Stock Items</h2>

//         {inventoryData.filter((item) => item.totalStock <= 3).length === 0 ? (
//           <p className="text-gray-500">No items are currently low in stock.</p>
//         ) : (
//           <div className="space-y-4">
//             {inventoryData
//               .filter((item) => item.totalStock <= 3)
//               .map((item, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: -10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   className="flex items-center p-4 bg-red-50 rounded-lg"
//                 >
//                   <FaExclamationTriangle className="text-red-500 mr-3" />
//                   <div>
//                     <h3 className="font-medium">{item.name}</h3>
//                     <p className="text-sm text-gray-600">
//                       Only {item.totalStock} units left in stock. Consider ordering more.
//                     </p>
//                   </div>
//                 </motion.div>
//               ))}
//           </div>
//         )}
//       </div>

//       {pendingReturns && pendingReturns.length > 0 && (
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4 flex items-center">
//             <FaUndo className="mr-2 text-purple-500" /> Pending Returns
//           </h2>
//           <div className="space-y-4">
//             {pendingReturns.map((item, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//                 className="flex items-center p-4 bg-purple-50 rounded-lg"
//               >
//                 <FaUndo className="text-purple-500 mr-3" />
//                 <div className="flex-1">
//                   <h3 className="font-medium">{item.itemName}</h3>
//                   <p className="text-sm text-gray-600">
//                     {item.quantity} units issued to {item.issuedTo} on {new Date(item.date).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => (window.location.href = "#returns")}
//                   className="px-3 py-1 bg-purple-100 text-purple-800 rounded-md text-sm font-medium hover:bg-purple-200"
//                 >
//                   Process
//                 </button>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       )}

//       {returnTransactions && returnTransactions.length > 0 && (
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4 flex items-center">
//             <FaUndo className="mr-2 text-green-500" /> Recent Returns
//           </h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Item Name
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Quantity
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Return Date
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Location
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {returnTransactions.map((item, index) => (
//                   <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.itemName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {new Date(item.date).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </motion.div>
//   )
// }

// export default Dashboard

// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import { FaBoxes, FaArrowUp, FaArrowDown, FaExclamationTriangle, FaUndo, FaDownload } from "react-icons/fa"
// import { API_URL } from "../api/api"

// function Dashboard() {
//   const [inventoryData, setInventoryData] = useState([])
//   const [pendingReturns, setPendingReturns] = useState([])
//   const [returnTransactions, setReturnTransactions] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setIsLoading(true)
//         setError(null)

//         const inventoryResponse = await fetch(`${API_URL}/api/dashboard`)
//         if (!inventoryResponse.ok) {
//           throw new Error(`Dashboard API returned ${inventoryResponse.status}: ${inventoryResponse.statusText}`)
//         }

//         const inventoryData = await inventoryResponse.json()

//         if (inventoryData.success) {
//           setInventoryData(inventoryData.inventory)

//           try {
//             const returnsResponse = await fetch(`${API_URL}/api/return/pending`)
//             if (!returnsResponse.ok) {
//               setPendingReturns([])
//             } else {
//               const returnsData = await returnsResponse.json()
//               if (returnsData.success) {
//                 setPendingReturns(returnsData.pendingItems || [])
//               } else {
//                 setPendingReturns([])
//               }
//             }

//             const returnHistoryResponse = await fetch(`${API_URL}/api/return/history`)
//             if (!returnHistoryResponse.ok) {
//               setReturnTransactions([])
//             } else {
//               const returnHistoryData = await returnHistoryResponse.json()
//               if (returnHistoryData.success) {
//                 setReturnTransactions(returnHistoryData.returns || [])
//               } else {
//                 setReturnTransactions([])
//               }
//             }
//           } catch (dataError) {
//             console.error("Error fetching additional data:", dataError)
//           }
//         } else {
//           setError(inventoryData.message || "Failed to fetch inventory data")
//         }
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error)
//         setError(`Error: ${error.message}. Please check that the backend server is running.`)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchDashboardData()
//   }, [])

//   const getPendingReturnsByItem = (itemName) => {
//     return pendingReturns.filter((item) => item.itemName === itemName).reduce((total, item) => total + item.quantity, 0)
//   }

//   const getReturnedItemsByName = (itemName) => {
//     return returnTransactions
//       .filter((item) => item.itemName === itemName)
//       .reduce((total, item) => total + item.quantity, 0)
//   }

//   const downloadCSV = () => {
//     const headers = ["Item Name", "Stock In", "Stock Out", "Returns", "Pending Returns", "Current Stock", "Location", "Status"]
//     const rows = inventoryData.map((item) => {
//       const pendingReturnsCount = getPendingReturnsByItem(item.name)
//       const returnedItemsCount = getReturnedItemsByName(item.name)
//       const status = item.totalStock <= 3 ? "Low Stock" : "In Stock"
//       return [
//         `"${item.name}"`,
//         item.stockIn,
//         item.stockOut,
//         returnedItemsCount,
//         pendingReturnsCount,
//         item.totalStock,
//         `"${item.location}"`,
//         `"${status}"`
//       ].join(",")
//     })
//     const csvContent = [headers.join(","), ...rows].join("\n")
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
//     const url = URL.createObjectURL(blob)
//     const link = document.createElement("a")
//     link.setAttribute("href", url)
//     link.setAttribute("download", "inventory_dashboard.csv")
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//         <h3 className="font-bold mb-2">Error Loading Dashboard</h3>
//         <p>{error}</p>
//       </div>
//     )
//   }

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold flex items-center">
//             <FaBoxes className="mr-2 text-blue-500" /> Inventory Dashboard
//           </h2>
//           <button
//             onClick={downloadCSV}
//             className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//           >
//             <FaDownload className="mr-2" /> Download CSV
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-blue-50 p-4 rounded-lg">
//             <h3 className="text-sm font-medium text-blue-800 mb-2">Total Items</h3>
//             <p className="text-2xl font-bold">{inventoryData.length}</p>
//           </div>
//           <div className="bg-green-50 p-4 rounded-lg">
//             <h3 className="text-sm font-medium text-green-800 mb-2">Total Stock In</h3>
//             <p className="text-2xl font-bold">{inventoryData.reduce((total, item) => total + item.stockIn, 0)}</p>
//           </div>
//           <div className="bg-red-50 p-4 rounded-lg">
//             <h3 className="text-sm font-medium text-red-800 mb-2">Total Stock Out</h3>
//             <p className="text-2xl font-bold">{inventoryData.reduce((total, item) => total + item.stockOut, 0)}</p>
//           </div>
//           <div className="bg-purple-50 p-4 rounded-lg">
//             <h3 className="text-sm font-medium text-purple-800 mb-2">Pending Returns</h3>
//             <p className="text-2xl font-bold">
//               {pendingReturns.reduce((total, item) => total + item.quantity, 0) || 0}
//             </p>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   <span className="flex items-center"><FaArrowUp className="text-green-500 mr-1" /> Stock In</span>
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   <span className="flex items-center"><FaArrowDown className="text-red-500 mr-1" /> Stock Out</span>
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   <span className="flex items-center"><FaUndo className="text-purple-500 mr-1" /> Returns</span>
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   <span className="flex items-center"><FaUndo className="text-purple-500 mr-1" /> Pending Returns</span>
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {inventoryData.map((item, index) => {
//                 const pendingReturnsCount = getPendingReturnsByItem(item.name)
//                 const returnedItemsCount = getReturnedItemsByName(item.name)
//                 return (
//                   <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.stockIn}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.stockOut}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{returnedItemsCount > 0 ? <span className="text-purple-600 font-medium">{returnedItemsCount}</span> : "0"}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pendingReturnsCount > 0 ? <span className="text-purple-600 font-medium">{pendingReturnsCount}</span> : "0"}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{item.totalStock}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {item.totalStock <= 3 ? (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 items-center"><FaExclamationTriangle className="mr-1" /> Low Stock</span>
//                       ) : (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">In Stock</span>
//                       )}
//                     </td>
//                   </tr>
//                 )
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// export default Dashboard


//  THIS CODE ALSO PERFECT POST API

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  FaBoxes,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
  FaUndo,
  FaDownload,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
} from "react-icons/fa"
import { API_URL } from "../api/api"

function Dashboard() {
  const [inventoryData, setInventoryData] = useState([])
  const [pendingReturns, setPendingReturns] = useState([])
  const [returnTransactions, setReturnTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [apiBaseUrl, setApiBaseUrl] = useState("")

  // Debug function to test API connectivity
  const testApiConnection = async () => {
    try {
      const testEndpoints = [`${API_URL}/api/test`, `${API_URL}/api/inventory`, `${API_URL}/api/dashboard`]

      for (const endpoint of testEndpoints) {
        console.log(`Testing endpoint: ${endpoint}`)
        try {
          const response = await fetch(endpoint)
          const status = response.status
          let body = "Could not parse response"

          try {
            body = await response.text()
            console.log(`Response from ${endpoint}:`, { status, body: body.substring(0, 100) + "..." })
          } catch (e) {
            console.log(`Error parsing response from ${endpoint}:`, e)
          }
        } catch (e) {
          console.log(`Error fetching ${endpoint}:`, e)
        }
      }
    } catch (e) {
      console.error("Error in API test:", e)
    }
  }

  useEffect(() => {
    // Set the API base URL for debugging
    setApiBaseUrl(API_URL)

    // Test API connection on component mount
    testApiConnection()

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log("Fetching dashboard data from:", `${API_URL}/api/dashboard`)

        const inventoryResponse = await fetch(`${API_URL}/api/dashboard`)
        if (!inventoryResponse.ok) {
          throw new Error(`Dashboard API returned ${inventoryResponse.status}: ${inventoryResponse.statusText}`)
        }

        // First try to get the response as text to debug
        const responseText = await inventoryResponse.text()
        console.log("Raw response:", responseText.substring(0, 200))

        // Then parse it as JSON
        let inventoryData
        try {
          inventoryData = JSON.parse(responseText)
        } catch (e) {
          throw new Error(`Failed to parse response as JSON. Response starts with: ${responseText.substring(0, 50)}...`)
        }

        if (inventoryData.success) {
          setInventoryData(inventoryData.inventory)

          try {
            const returnsResponse = await fetch(`${API_URL}/api/return/pending`)
            if (!returnsResponse.ok) {
              setPendingReturns([])
            } else {
              const returnsData = await returnsResponse.json()
              if (returnsData.success) {
                setPendingReturns(returnsData.pendingItems || [])
              } else {
                setPendingReturns([])
              }
            }

            const returnHistoryResponse = await fetch(`${API_URL}/api/return/history`)
            if (!returnHistoryResponse.ok) {
              setReturnTransactions([])
            } else {
              const returnHistoryData = await returnHistoryResponse.json()
              if (returnHistoryData.success) {
                setReturnTransactions(returnHistoryData.returns || [])
              } else {
                setReturnTransactions([])
              }
            }
          } catch (dataError) {
            console.error("Error fetching additional data:", dataError)
          }
        } else {
          setError(inventoryData.message || "Failed to fetch inventory data")
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError(`Error: ${error.message}. Please check that the backend server is running.`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getPendingReturnsByItem = (itemName) => {
    return pendingReturns.filter((item) => item.itemName === itemName).reduce((total, item) => total + item.quantity, 0)
  }

  const getReturnedItemsByName = (itemName) => {
    return returnTransactions
      .filter((item) => item.itemName === itemName)
      .reduce((total, item) => total + item.quantity, 0)
  }

  const handleEdit = (item) => {
    console.log("Editing item:", item)
    setEditingItem(item._id)
    setEditForm({
      name: item.name,
      stockIn: item.stockIn,
      stockOut: item.stockOut,
      location: item.location,
    })
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setEditForm({})
  }

  const handleSaveEdit = async () => {
    try {
      console.log("Saving edit for item ID:", editingItem)
      console.log("Edit form data:", editForm)

      const url = `${API_URL}/api/inventory/${editingItem}`
      console.log("API URL:", url)

      const requestData = {
        name: editForm.name,
        stockIn: Number.parseInt(editForm.stockIn),
        stockOut: Number.parseInt(editForm.stockOut),
        location: editForm.location,
      }

      console.log("Request data:", JSON.stringify(requestData))

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      console.log("Response status:", response.status)
      console.log("Response ok:", response.ok)

      // Get response as text first for debugging
      const responseText = await response.text()
      console.log("Raw response:", responseText)

      let updatedData
      try {
        updatedData = JSON.parse(responseText)
        console.log("Parsed response:", updatedData)
      } catch (e) {
        console.error("Failed to parse response as JSON:", e)
        alert(`Error: Server returned invalid JSON. Response starts with: ${responseText.substring(0, 50)}...`)
        return
      }

      if (response.ok && updatedData.success) {
        // Update the local state
        setInventoryData((prevData) =>
          prevData.map((item) =>
            item._id === editingItem
              ? {
                  ...item,
                  name: editForm.name,
                  stockIn: Number.parseInt(editForm.stockIn),
                  stockOut: Number.parseInt(editForm.stockOut),
                  location: editForm.location,
                  totalStock: Number.parseInt(editForm.stockIn) - Number.parseInt(editForm.stockOut),
                }
              : item,
          ),
        )
        setEditingItem(null)
        setEditForm({})
        alert("Item updated successfully!")
      } else {
        alert("Failed to update item: " + (updatedData.message || "Unknown error"))
      }
    } catch (error) {
      console.error("Error updating item:", error)
      alert("Error updating item: " + error.message)
    }
  }

  const handleDelete = (item) => {
    setDeleteConfirm(item)
  }

  const confirmDelete = async () => {
    try {
      console.log("Deleting item ID:", deleteConfirm._id)

      const url = `${API_URL}/api/inventory/${deleteConfirm._id}`
      console.log("API URL:", url)

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Delete response status:", response.status)

      // Get response as text first for debugging
      const responseText = await response.text()
      console.log("Raw delete response:", responseText)

      let result
      try {
        result = JSON.parse(responseText)
        console.log("Parsed delete response:", result)
      } catch (e) {
        console.error("Failed to parse delete response as JSON:", e)
        alert(`Error: Server returned invalid JSON. Response starts with: ${responseText.substring(0, 50)}...`)
        return
      }

      if (response.ok && result.success) {
        // Remove the item from local state
        setInventoryData((prevData) => prevData.filter((item) => item._id !== deleteConfirm._id))
        setDeleteConfirm(null)
        alert("Item deleted successfully!")
      } else {
        alert("Failed to delete item: " + (result.message || "Unknown error"))
      }
    } catch (error) {
      console.error("Error deleting item:", error)
      alert("Error deleting item: " + error.message)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirm(null)
  }

  const downloadCSV = () => {
    const headers = [
      "Item Name",
      "Stock In",
      "Stock Out",
      "Returns",
      "Pending Returns",
      "Current Stock",
      "Location",
      "Status",
    ]
    const rows = inventoryData.map((item) => {
      const pendingReturnsCount = getPendingReturnsByItem(item.name)
      const returnedItemsCount = getReturnedItemsByName(item.name)
      const status = item.totalStock <= 3 ? "Low Stock" : "In Stock"
      return [
        `"${item.name}"`,
        item.stockIn,
        item.stockOut,
        returnedItemsCount,
        pendingReturnsCount,
        item.totalStock,
        `"${item.location}"`,
        `"${status}"`,
      ].join(",")
    })
    const csvContent = [headers.join(","), ...rows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "inventory_dashboard.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      {/* API Debug Info */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <h3 className="font-bold mb-2">Error Loading Dashboard</h3>
          <p>{error}</p>
          <div className="mt-4 p-3 bg-gray-100 rounded text-sm font-mono overflow-auto">
            <p>
              <strong>API Base URL:</strong> {apiBaseUrl}
            </p>
            <p>
              <strong>Debug:</strong> Check browser console for detailed logs
            </p>
            <button onClick={testApiConnection} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs">
              Test API Connection
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={cancelDelete} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 hover:cursor-pointer">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 hover:cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <FaBoxes className="mr-2 text-blue-500" /> Inventory Dashboard
          </h2>
          <button
            onClick={downloadCSV}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <FaDownload className="mr-2" /> Download CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Total Items</h3>
            <p className="text-2xl font-bold">{inventoryData.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800 mb-2">Total Stock In</h3>
            <p className="text-2xl font-bold">{inventoryData.reduce((total, item) => total + item.stockIn, 0)}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-800 mb-2">Total Stock Out</h3>
            <p className="text-2xl font-bold">{inventoryData.reduce((total, item) => total + item.stockOut, 0)}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800 mb-2">Pending Returns</h3>
            <p className="text-2xl font-bold">
              {pendingReturns.reduce((total, item) => total + item.quantity, 0) || 0}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center">
                    <FaArrowUp className="text-green-500 mr-1" /> Stock In
                  </span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center">
                    <FaArrowDown className="text-red-500 mr-1" /> Stock Out
                  </span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center">
                    <FaUndo className="text-purple-500 mr-1" /> Returns
                  </span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center">
                    <FaUndo className="text-purple-500 mr-1" /> Pending Returns
                  </span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryData.map((item, index) => {
                const pendingReturnsCount = getPendingReturnsByItem(item.name)
                const returnedItemsCount = getReturnedItemsByName(item.name)
                const isEditing = editingItem === item._id

                return (
                  <tr key={item._id || index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.stockIn}
                          onChange={(e) => setEditForm({ ...editForm, stockIn: e.target.value })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        item.stockIn
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.stockOut}
                          onChange={(e) => setEditForm({ ...editForm, stockOut: e.target.value })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        item.stockOut
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {returnedItemsCount > 0 ? (
                        <span className="text-purple-600 font-medium">{returnedItemsCount}</span>
                      ) : (
                        "0"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pendingReturnsCount > 0 ? (
                        <span className="text-purple-600 font-medium">{pendingReturnsCount}</span>
                      ) : (
                        "0"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {isEditing
                        ? Number.parseInt(editForm.stockIn || 0) - Number.parseInt(editForm.stockOut || 0)
                        : item.totalStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        item.location
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(isEditing
                        ? Number.parseInt(editForm.stockIn || 0) - Number.parseInt(editForm.stockOut || 0)
                        : item.totalStock) <= 3 ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 items-center">
                          <FaExclamationTriangle className="mr-1" /> Low Stock
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isEditing ? (
                        <div className="flex space-x-2">
                          <button onClick={handleSaveEdit} className="text-green-600 hover:text-green-900" title="Save">
                            <FaSave />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-900"
                            title="Cancel"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <FaEdit className="h-5 w-5 hover:cursor-pointer" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FaTrash className="h-5 w-5 hover:cursor-pointer" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard

