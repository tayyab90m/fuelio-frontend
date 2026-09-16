import React from 'react'

const WorkoutGenerator = () => {
  return (
    <div>
      <h2 className='mb-4 font-bold text-2xl'>Workout Program Generator</h2>
      <div className=" mx-auto px-4 py-4 bg-gray-100 rounded-lg">
         <h2 className='text-rose-500 mb-3 font-bold'>Search for suitable programs</h2>
        <form className="space-y-4">
          {/* Input Fields */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor="name" className="block font-bold text-sm text-gray-700">
                Goal
              </label>
              <select
                id="country"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
              >
                <option>Lose fat/ Tone up</option>
                <option>Gain muscle</option>
                <option>Bodyweight Circuit Training</option>
                <option>Shred</option>
                <option>Bulk</option>
                <option>Gain Lean Muscle</option>
                <option>Lose Fat and Tone</option>
              </select>

            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                Session
              </label>
              <select
                id="country"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
              >
                <option>30 Minutes</option>
                <option>60 Minutes</option>
                <option>60 to 90 Minutes</option>
              </select>
            </div>
          </div>


          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor="country" className="block text-sm font-bold text-gray-700">
                Gender
              </label>
              <select
                id="country"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-bold text-gray-700">
                Weeks
              </label>
              <select
                id="gender"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
              >
                <option>3</option>
                <option>4</option>
                <option>12</option>
                <option>16</option>
              </select>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor="role" className="block text-sm font-bold text-gray-700">
                Days
              </label>
              <select
                id="role"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
              >
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
              </select>
            </div>
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

      <div className=" mx-auto px-4 mt-5 py-4 bg-gray-100 rounded-lg">
         <h2 className='text-rose-500 mb-3 font-bold'>Generate Program</h2>
        <form className="space-y-4">
          {/* Input Fields */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor="name" className="block font-bold text-sm text-gray-700">
                Program set
              </label>
              <select
                id="country"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
              >
                <option>Personalised Workout</option>
                <option>Male Bulk Gym 3D-60-90 - Male/Any/Bulk/3D/90</option>
                <option>Personalised Workout - Circuit Training</option>
                <option>
									Male Bodyweight Circuit Training 3D-30 - Male/Any/Bodyweight Circuit Training/3D/30
								</option>
                <option>
									Female Bodyweight Circuit Training 3D-30 - Female/Any/Bodyweight Circuit Training/3D/30
								</option>
                <option>
									Male Bodyweight Circuit Training 5D-30 - Male/Any/Bodyweight Circuit Training/5D/30
								</option>
                <option>
									Female Bodyweight Circuit Training 5D-30 - Female/Any/Bodyweight Circuit Training/5D/30
								</option>

                <option>
                  Training Program
								</option>
                <option>
                  Male Shred Gym 3D-60-90 - Male/Any/Shred/3D/90
								</option>
                <option>
                  Male Shred Gym 4D-60-90 - Male/Any/Shred/4D/90
								</option>
                <option>
									Female Workout Gain 3D-60-90 - Female/Any/Gain Lean Muscle/3D/90
								</option>
                <option>
									Female Workout Gain 4D-60-90 - Female/Any/Gain Lean Muscle/4D/90
								</option>
                <option>
									Female Workout Gain 5D-60-90 - Female/Any/Gain Lean Muscle/5D/90
								</option>
              </select>

            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                Experience Level
              </label>
              <select
                id="country"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>


          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor="country" className="block text-sm font-bold text-gray-700">
                Location
              </label>
              <select
                id="country"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
              >
                <option>Gym Only</option>
                <option>Home Only</option>
              </select>
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-bold text-gray-700">
                Period
              </label>
              <input type="text" className='mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm' />
            </div>
          </div>


          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor="gender" className="block text-sm font-bold text-gray-700">
                Period duration
              </label>
              <input type="text"  className='mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm'/>
            </div>
          </div>

          {/* Submit Button */}
          <div className='w-[200px] ml-auto'>
            <button
              type="submit"
              className="w-full px-4 py-3 text-white bg-rose-600 rounded-lg shadow hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              Generate Program
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WorkoutGenerator