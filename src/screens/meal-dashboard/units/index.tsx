import React, { useEffect, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store';

import { onGetAllUnits } from '../../../redux/meals/action'

const Units = () => {
  const { mealUnits } = useSelector((state: RootState) => state.mealsReducer)
  useLayoutEffect(() => {
    onGetAllUnits();
  }, [])

  return (
    <div className="mx-auto">
      <div className=''>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Units
          </h2>
        </div>
      </div>
      <div className="overflow-y-auto mt-4 bg-white rounded-xl ">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-secondary">
            <tr>
              <th className=" px-6 py-5 text-white text-left text-base font-medium text-white uppercase">
                Name
              </th>
              <th className="px-6 py-5 text-white text-left text-base font-semibold text-gray-500 uppercase">
                Short
              </th>
              <th className="px-6 py-5 text-white text-left text-base font-semibold text-gray-500 uppercase">
                Code
              </th>
              <th className="px-6 py-5 text-white text-left text-base font-semibold text-gray-500 uppercase">
                Equivalent To
              </th>
              <th className="px-6 py-5 text-white text-left text-base font-semibold text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-5 text-white text-left text-base font-semibold text-gray-500 uppercase">
                System
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {
              mealUnits && mealUnits.length > 0 ? (
                mealUnits.map((unit) => (
                  <tr className="hover:bg-gray-50" key={unit.code}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm capitalize font-medium text-gray-900">
                        {unit.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {unit.short}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {unit.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {unit.equivalentTo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {unit.unitType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {unit.system}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                    No data available
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Units