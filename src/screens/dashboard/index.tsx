import React from 'react'
import Sidebar from '../../components/Sidebar'
import DashboardContainer from './dashboardContainer';
import { Outlet } from "react-router-dom";
const Dashboard = () => {
  return (
    <div className='grid w-full'>
      <DashboardContainer/>
    </div>
  )
}

export default Dashboard