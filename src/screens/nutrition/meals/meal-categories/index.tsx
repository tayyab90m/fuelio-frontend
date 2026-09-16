import { Plus, Search } from 'lucide-react'
import React,{FC} from 'react'
import { Link } from 'react-router'

const MealCategories: FC = () => {
  return (
    <div className="p-6 mx-auto">
      <div className='bg-white p-5'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Categories Types
          </h2>
          <div className='flex gap-3'>
            <div className="relative flex items-center group">
              <input
                type="text"
                className="border rounded-tr-none border-stone-500 group-hover:px-3 focus:border-rose-400 focus-visible:border-rose-500 rounded-br-none w-0 h-full transition-all duration-700 ease-in-out group-hover:w-[300px] focus:w-[300px] overflow-hidden"
              />

              <span
                className="bg-rose-600 w-[40px] ml-[-5px] flex items-center justify-center rounded h-full transition-transform ease-in-out"
              >
                <Search className="text-white" />
              </span>
            </div>
            <Link to="new-categories" className='group inline-block p-2 bg-red-600 rounded cursor-pointer'>
              <Plus className="text-white font-extrabold transform transition-transform duration-300 group-hover:rotate-90" />
            </Link>
          </div>
        </div>
        <div className='publish-section flex gap-4 border-t pt-4 mt-4'>
          <h2 className='font-semibold text-xl'>
            Published
          </h2>
          <div className="custom-radio-group">
            <label className="custom-radio font-semibold">
              <input type="radio" name="option" value="1" />
              <span className="radio-checkmark"></span>
              Yes
            </label>
            <label className="custom-radio font-semibold">
              <input type="radio" name="option" value="2" />
              <span className="radio-checkmark"></span>
              No
            </label>
            <label className="custom-radio font-semibold">
              <input type="radio" name="option" value="3" />
              <span className="radio-checkmark"></span>
              All
            </label>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto p-4 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className=" px-6 py-3 text-left text-base font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-base font-semibold text-gray-500 uppercase">
                Code
              </th>
              <th className="px-6 py-3 text-left text-base font-semibold text-gray-500 uppercase">
                State
              </th>
              <th className="px-6 py-3 text-left text-base font-semibold text-gray-500 uppercase">
                In use
              </th>
              <th className="px-6 py-3 text-left text-base font-semibold text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  Hormones
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full text-gray-500">
                  tr-hormones
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Draft
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Yes
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Edit
                </a>
                <a href="#" className="text-red-600 hover:text-red-900">
                  Delete
                </a>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  Indian
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full text-gray-500">
                  indian-29227
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Published
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Yes
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Edit
                </a>
                <a href="#" className="text-red-600 hover:text-red-900">
                  Delete
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MealCategories