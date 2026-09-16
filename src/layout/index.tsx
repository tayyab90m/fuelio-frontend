import React from 'react'
import { Outlet } from 'react-router'
import Sidebar from '../components/Sidebar'
import MealDashboard from '../screens/meal-dashboard'

const Layout = () => {
  return (
    <div className="flex">
      {/* <Sidebar/> */}
      <Outlet/>
    </div>
  )
}

export default Layout