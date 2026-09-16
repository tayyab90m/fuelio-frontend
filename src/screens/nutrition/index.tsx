import React, {useEffect} from 'react'
import { Outlet,useNavigate,useLocation } from 'react-router'

const Nutrition = () => {

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=> {
    if (location.pathname === '/') {
    navigate("/dashboard/coach-dashboard");
    }
  },[])

  return (
    <div className='w-full'>
      <Outlet/>
    </div>
  )
}

export default Nutrition