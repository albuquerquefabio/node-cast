import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import Brand from '../brand/Brand';

export const Navbar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const navItems = [
    { id: 'home', text: 'Home', to: '/' },
    { id: 'login', text: 'Login', to: '/login' },
  ];

  return (
    <nav className="relative bg-gray-800 z-10">
      {/* <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/Login">Login</Link>
          </li>
        </ul>
      </div> */}
      <div className="flex justify-between items-center h-24 max-w-[1240px] max-auto px-4 text-white z-10">
        <Brand />

        <ul className="hidden md:flex">
          {navItems.map((item) => (
            <li
              key={item.id}
              className="p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-gray-800"
            >
              <Link to={item.to} className="block w-full h-full">
                {item.text}
              </Link>
            </li>
          ))}
        </ul>

        <div onClick={handleNav} className="block md:hidden">
          {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </div>

        <ul
          className={
            nav
              ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-950 bg-gray-900 ease-in-out duration-500'
              : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
          }
        >
          {navItems.map((item) => (
            <li
              key={item.id}
              className="border-b hover:bg-[#00df9a] duration-300 hover:text-gray-800 cursor-pointer border-gray-600"
              onClick={handleNav}
            >
              <Link to={item.to} className="p-4 block w-full h-full">
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {nav && (
        <div
          className="fixed inset-0 bg-black opacity-50 -z-1"
          onClick={handleNav}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
