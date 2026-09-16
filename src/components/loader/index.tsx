import React from 'react'

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-rose-500 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-rose-500 rounded-full animate-bounce delay-150"></div>
        <div className="w-4 h-4 bg-rose-500 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  )
}

export default Loader;