import React from 'react'
import { Outlet } from 'react-router'

const Layout = () => {
  return (
    <div className="flex">
      {/* <Sidebar/> */}
      <Outlet/>
    </div>
  )
}

export default Layout