import React from 'react'
import Sidebar from '../../components/Sidebar'
import Avatar1 from '../../assets/images/avatar1.jpg';
import Avatar2 from '../../assets/images/avatar2.jpg';
import { useNavigate } from 'react-router';
const DashboardContainer = () => {
  const navigate =  useNavigate()
  return (
    <div className=''>
      <header className="pb-5 flex justify-between items-center">
        <div>
          <h1 className="font-extrabold text-2xl">Welcome back, coach Mike</h1>
          <small className='text-stone-400 font-bold'>Wednesday, 24 November 2024</small>
        </div>
      </header>
      <section className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-gray-600">Tasks Due Today</p>
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm">8</span>
            </div>
            <p className="text-2xl font-bold mt-2">12 Total Tasks</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-gray-600">Today's Sessions</p>
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">4</span>
            </div>
            <p className="text-2xl font-bold mt-2">3 Remaining</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-gray-600">Check-ins Due</p>
              <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-sm">5</span>
            </div>
            <p className="text-2xl font-bold mt-2">8 Pending</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-gray-600">Messages</p>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm">New</span>
            </div>
            <p className="text-2xl font-bold mt-2">12 Unread</p>
          </div>
        </div>
      </section>
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Today's Tasks */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Today's Tasks</h2>
                <button className="text-sm text-red-600 font-semibold">View All</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <input type="checkbox" className="rounded" />
                    <div>
                      <p className="font-medium">Review John's Progress Photos</p>
                      <p className="text-sm text-gray-600">Due in 2 hours</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">High Priority</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <input type="checkbox" className="rounded" />
                    <div>
                      <p className="font-medium">Update Sarah's Meal Plan</p>
                      <p className="text-sm text-gray-600">Due today</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm">Medium</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <input type="checkbox" className="rounded" />
                    <div>
                      <p className="font-medium">Check-in Response: Mike Smith</p>
                      <p className="text-sm text-gray-600">Due today</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">Normal</span>
                </div>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Upcoming Sessions</h2>
                <button className="text-sm font-semibold text-red-500">View Schedule</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-blue-600">JS</span>
                    </div>
                    <div>
                      <p className="font-medium">John Smith</p>
                      <p className="text-sm text-gray-600">10:00 AM - Initial Consultation</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-red-600 font-semibold text-sm text-white rounded-lg">Join Call</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-purple-600">AW</span>
                    </div>
                    <div>
                      <p className="font-medium">Alice Wilson</p>
                      <p className="text-sm text-gray-600">2:00 PM - Progress Review</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">In 4 hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side Content Section */}
          <div className="space-y-6">
            {/* Alerts & Updates */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-6">Alerts & Updates</h2>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  <p className="font-medium">Missed Check-in</p>
                  <p className="text-sm">Sarah hasn't logged her meals for 3 days</p>
                </div>
                <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">
                  <p className="font-medium">Goal Update</p>
                  <p className="text-sm">Mike reached 80% of his monthly goal</p>
                </div>
              </div>
            </div>

            {/* Recent Client Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-6">Recent Client Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden">
                    <img src={Avatar2} alt="" className="w-full" />
                  </div>
                  <div>
                    <p className="font-medium">John logged a workout</p>
                    <p className="text-sm text-gray-600">10 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden">
                    <img src={Avatar1} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium">Sarah completed her check-in</p>
                    <p className="text-sm text-gray-600">25 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DashboardContainer