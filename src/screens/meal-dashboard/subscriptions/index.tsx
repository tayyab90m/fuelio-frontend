import React from 'react'
const data = [
  {
    customer: "John Doe",
    pricingPlan: "Premium",
    price: "$50",
    duration: "1 Month",
    ar: "Active",
    state: "California",
    renewsExpires: "Renews Jan 15, 2025",
  },
  {
    customer: "Jane Smith",
    pricingPlan: "Basic",
    price: "$20",
    duration: "6 Months",
    ar: "Expired",
    state: "New York",
    renewsExpires: "Expired Dec 20, 2024",
  },
];
const Subscriptions = () => {
  return (
    <div className='sale-sub'>
        <h2 className='text-2xl font-bold mb-4 '>Subscriptions</h2>
      <div className=" mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
        <form className="space-y-4">
          {/* Input Fields */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
              />
            </div>
          </div>


          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Subscription State
              </label>
              <select
                id="country"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
              >
                <option>Any</option>
                <option>Active</option>
                <option>Unpaid</option>
                <option>No Data</option>
                <option>Cancelled</option>
                <option>Expired</option>
              </select>
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Plan Type
              </label>
              <select
                id="gender"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
              >
                <option>Select your gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>


          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Pricing Plan
            </label>
            <select
              id="role"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
            >
              <option>12 Week Platinum Coaching</option>
              <option>4 Week Starter</option>
              <option>6 Week Challenge</option>
              <option>6 week challenge</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className='w-[150px] ml-auto'>
            <button
              type="submit"
              className="w-full px-4 py-3 text-white bg-rose-600 rounded-lg shadow hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left">Customer</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Pricing Plan</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Price</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Duration</th>
                <th className="border border-gray-300 px-4 py-3 text-left">AR</th>
                <th className="border border-gray-300 px-4 py-3 text-left">State</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Renews/Expires</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-300 px-4 py-3">{row.customer}</td>
                  <td className="border border-gray-300 px-4 py-3">{row.pricingPlan}</td>
                  <td className="border border-gray-300 px-4 py-3">{row.price}</td>
                  <td className="border border-gray-300 px-4 py-3">{row.duration}</td>
                  <td className="border border-gray-300 px-4 py-3">{row.ar}</td>
                  <td className="border border-gray-300 px-4 py-3">{row.state}</td>
                  <td className="border border-gray-300 px-4 py-3">{row.renewsExpires}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Subscriptions