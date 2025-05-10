// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import { FaBoxOpen, FaChartBar, FaArrowRight, FaArrowLeft } from "react-icons/fa"
// import StockIn from "./components/StockIn"
// import StockOut from "./components/StockOut"
// import Dashboard from "./components/Dashboard"
// import "./App.css"

// function App() {
//   const [activeTab, setActiveTab] = useState("home")

//   const tabs = [
//     { id: "home", label: "Home", icon: <FaBoxOpen className="mr-2" /> },
//     { id: "stockIn", label: "Stock In", icon: <FaArrowRight className="mr-2" /> },
//     { id: "stockOut", label: "Stock Out", icon: <FaArrowLeft className="mr-2" /> },
//     { id: "dashboard", label: "Dashboard", icon: <FaChartBar className="mr-2" /> },
//   ]

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <h1 className="text-2xl font-bold text-gray-900">Inventory Management System</h1>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-6">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium w-full ${
//                 activeTab === tab.id
//                   ? "bg-white shadow-sm text-gray-800"
//                   : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
//               }`}
//             >
//               {tab.icon}
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {activeTab === "home" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="bg-white p-6 rounded-lg shadow"
//             >
//               <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
//                 <FaArrowRight className="mr-2 text-green-500" /> Stock In
//               </h2>
//               <p className="text-gray-600 mb-4">Add new inventory items or return items to your stock.</p>
//               <button
//                 onClick={() => setActiveTab("stockIn")}
//                 className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-200"
//               >
//                 Go to Stock In
//               </button>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.1 }}
//               className="bg-white p-6 rounded-lg shadow"
//             >
//               <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
//                 <FaArrowLeft className="mr-2 text-red-500" /> Stock Out
//               </h2>
//               <p className="text-gray-600 mb-4">Issue items to students or startups from your inventory.</p>
//               <button
//                 onClick={() => setActiveTab("stockOut")}
//                 className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-200"
//               >
//                 Go to Stock Out
//               </button>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="bg-white p-6 rounded-lg shadow md:col-span-2"
//             >
//               <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
//                 <FaChartBar className="mr-2 text-blue-500" /> Stock Dashboard
//               </h2>
//               <p className="text-gray-600 mb-4">View your current inventory levels and transaction history.</p>
//               <button
//                 onClick={() => setActiveTab("dashboard")}
//                 className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200"
//               >
//                 Go to Dashboard
//               </button>
//             </motion.div>
//           </div>
//         )}

//         {activeTab === "stockIn" && <StockIn />}
//         {activeTab === "stockOut" && <StockOut />}
//         {activeTab === "dashboard" && <Dashboard />}
//       </main>
//     </div>
//   )
// }

// export default App

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FaBoxOpen, FaChartBar, FaArrowRight, FaArrowLeft, FaUndo } from "react-icons/fa"
import StockIn from "./components/StockIn"
import StockOut from "./components/StockOut"
import Dashboard from "./components/Dashboard"
import Returns from "./components/Returns"
import "./App.css"

function App() {
  const [activeTab, setActiveTab] = useState("home")

  const tabs = [
    { id: "home", label: "Home", icon: <FaBoxOpen className="mr-2" /> },
    { id: "stockIn", label: "Stock In", icon: <FaArrowRight className="mr-2" /> },
    { id: "stockOut", label: "Stock Out", icon: <FaArrowLeft className="mr-2" /> },
    { id: "returns", label: "Returns", icon: <FaUndo className="mr-2" /> },
    { id: "dashboard", label: "Dashboard", icon: <FaChartBar className="mr-2" /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management System</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium w-full ${
                activeTab === tab.id
                  ? "bg-white shadow-sm text-gray-800"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "home" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-lg shadow"
            >
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FaArrowRight className="mr-2 text-green-500" /> Stock In
              </h2>
              <p className="text-gray-600 mb-4">Add new inventory items or return items to your stock.</p>
              <button
                onClick={() => setActiveTab("stockIn")}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-200"
              >
                Go to Stock In
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow"
            >
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FaArrowLeft className="mr-2 text-red-500" /> Stock Out
              </h2>
              <p className="text-gray-600 mb-4">Issue items to students or startups from your inventory.</p>
              <button
                onClick={() => setActiveTab("stockOut")}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-200"
              >
                Go to Stock Out
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow"
            >
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FaUndo className="mr-2 text-purple-500" /> Returns
              </h2>
              <p className="text-gray-600 mb-4">Process returns of items that were issued as returnable.</p>
              <button
                onClick={() => setActiveTab("returns")}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition duration-200"
              >
                Go to Returns
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow"
            >
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FaChartBar className="mr-2 text-blue-500" /> Stock Dashboard
              </h2>
              <p className="text-gray-600 mb-4">View your current inventory levels and transaction history.</p>
              <button
                onClick={() => setActiveTab("dashboard")}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200"
              >
                Go to Dashboard
              </button>
            </motion.div>
          </div>
        )}

        {activeTab === "stockIn" && <StockIn />}
        {activeTab === "stockOut" && <StockOut />}
        {activeTab === "returns" && <Returns />}
        {activeTab === "dashboard" && <Dashboard />}
      </main>
    </div>
  )
}

export default App
