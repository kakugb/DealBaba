import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import DealBaba from '../../assets/Dealbablogo.png'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'; 
import { logout } from '../../../store/authSlice.js';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}



export default function Header() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    console.log("Logging out...");
     
   
    localStorage.removeItem('token'); 
    localStorage.removeItem('user')
    localStorage.setItem('isAuthenticated', 'false');
    
    dispatch(logout());
  
  };
  return (
    <Disclosure as="nav" className="bg-gray-100 border-opacity-60 border-slate-600 fixed w-full top-0 left-0 z-30 shadow-lg shadow-gray-300 ">
      <div className="px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img
                alt="DealBaba"
                src={DealBaba}
                className="h-14 w-16"
              />
              <h1 className='ml-4 pt-4 text-2xl font-bold text-red-800'>DealBaba</h1>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Link
                  to='/shopOwner/dashboard'
                  className={classNames(
                    'text-black hover:bg-red-900 hover:text-white',
                    'rounded-md px-3 py-2 text-md font-semibold'
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  to='/shopowner/dealPage'
                  className={classNames(
                    'text-black hover:bg-red-900 hover:text-white',
                    'rounded-md px-3 py-2 text-md font-semibold'
                  )}
                >
                  Deals
                </Link>
              </div>
            </div>
            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-6">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src=""
                    className="size-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                <MenuItem>
                  <button
                    onClick={handleLogout}
                    className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden absolute z-30 w-full bg-gray-200">
        <div className="space-y-1 px-2 pb-3 pt-2">
          <Link
            to='/shopOwner/dashboard'
            className={classNames(
              'block rounded-md px-3 py-2 text-base font-medium text-black  hover:bg-red-900 hover:text-white'
            )}
          >
            Dashbaord
          </Link>
          <Link
            to='/shopowner/dealPage'
            className={classNames(
              'block rounded-md px-3 py-2 text-base font-medium text-black  hover:bg-red-900 hover:text-white '
            )}
          >
            Deal
          </Link>
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
