import React, {useEffect} from 'react'
import { useSelector } from 'react-redux'
import { Outlet,useNavigate,useLocation } from 'react-router'
import { RootState } from '../../redux/store'
import { homePathFor } from '../../utils/roles'

const Nutrition = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const role = useSelector((state: RootState) => state.userReducer.userData?.user?.role);

  useEffect(()=> {
    if (location.pathname === '/') {
    navigate(homePathFor(role));
    }
    // Redirect once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div className='w-full'>
      <Outlet/>
    </div>
  )
}

export default Nutrition