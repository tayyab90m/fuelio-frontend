import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { User, Users, ChevronsLeft, ChevronsRight, Bolt } from 'lucide-react';
import { sidebarItems } from '../../utils/helpers/sidebarItems';


const Sidebar: React.FC = () => {
  // State to track open/close status of each dropdown
  const [openDropdown, setOpenDropdown] = useState<any | null>(null);
  const [openMenu, setOpenMenu] = useState(false);

  // Toggle a specific dropdown
  // const toggleDropdown = (key: string) => {
  //   setOpenDropdowns((prevState) => ({
  //     ...prevState,
  //     [key]: !prevState[key],
  //   }));
  // };
  const handleMenu = () => {
    setOpenMenu(!openMenu);
    setOpenDropdown(false);
  }

  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? ' ml-5 pt-2 mb-4 border-b-2 border-b-[#E1172C] text-[#E1172C] font-semibold'
      : ' ml-5 pt-2 mb-4 transition-all border-b-transparent border-b-2 hover:text-[#E1172C] hover:border-b-[#E1172C] hover:border-b-2  text-stone-500 font-semibold';
  const nestedLinkStyle = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'ml-4 items-baseline border-b-2 border-b-[#E1172C] text-[#E1172C] font-semibold'
      : 'ml-4 items-baseline transition-all border-b-transparent border-b-2 hover:text-[#E1172C] hover:border-b-[#E1172C] hover:border-b-2  text-stone-500 font-semibold';
  return (
    <div className={`bg-white sticky top-0 self-start overflow-hidden h-screen transition-all ${openMenu ? " w-[60px]" : "w-[250px]"}`}>
      <div className=''>
        <div className="flex mt-4 items-center justify-end text-xl font-bold text-center">
          <Link to='/dashboard/coach-dashboard'>
            <h3 className=' pl-4 flex items-center whitespace-nowrap'>Boss Bodies</h3>
          </Link>
          <button className='ml-auto px-[20px]'>
            {
              openMenu ?
                <ChevronsLeft
                  onClick={handleMenu}
                /> :
                <ChevronsRight
                  onClick={handleMenu}
                />
            }
          </button>
        </div>
        <nav className="mt-1">
          <ul className='px-3'>
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <div className="flex text-stone-500 rounded-[17px] p-[15px] items-center justify-between cursor-pointer hover:shadow-lg hover:shadow-gray-300 hover:bg-[#E1172C] hover:text-white"
                  onClick={() => setOpenDropdown(item.id)}>
                  <span className='flex gap-4'>
                    <Users />
                    <span className='font-semibold'>{item.label}</span>
                  </span>
                  <span
                    className={`transition-transform duration-300 ${openDropdown === item.id ? 'rotate-90' : ''
                      }`}
                  >
                    ▶
                  </span>
                </div>
                <ul
                  className={`overflow-hidden flex flex-col gap-2 transition-all duration-300 ${openDropdown === item.id ? '' : 'max-h-0'
                    }`}
                >
                  {item?.children && item?.children.map((child, index) => (
                    <li className='text-stone-500' key={index}>
                      <NavLink to={child.path || ''} className={linkStyle}>
                        {child?.label}
                      </NavLink>
                      <div className='ml-4 mt-2'>
                        <ul className='flex flex-col gap-2 items-baseline'>
                          {
                            child?.siblings && child?.siblings.map((sib, index) => (
                              <NavLink key={index} to={sib.path || ''} className={nestedLinkStyle}>
                                <li key={index}>{sib.label}</li>
                              </NavLink>
                            ))
                          }
                        </ul>
                      </div>
                    </li>
                  ))
                  }
                </ul>
              </li>
            ))
            }
          </ul>
          
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
