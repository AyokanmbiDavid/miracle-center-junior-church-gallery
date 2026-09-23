import React, { useState, useEffect } from 'react';
import applogo from '../../images/images.png';
import { Sun, Moon } from '@phosphor-icons/react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from 'lucide-react';

const Navbar = ({setshowside}) => {
  const location = useLocation().pathname

  return (
    <div className="w-full p-3 flex justify-between items-center bg-white dark:bg-gray-900 transition-all duration-200">
      <div className="flex gap-2 items-center">
      {/*sidebar icon */}
      <div
      onClick={() => setshowside()}
      className="bg-[var(--blue-lvl4)] p-2 rounded-xl cursor-pointer group max-md:hidden">
        <Sidebar size={20} className='group-hover:scale-109 duration-150 ease-in-out'/>
      </div>

        <div className="rounded-full">
          <img src={applogo} alt="App Logo" className="rounded-full h-10 w-10 object-cover" />
        </div>

        <div>
          <h1 className="text-md flex flex-col text-gray-800 dark:text-white">
           
            <span className="font-bold">
               Junior church Gallery
            </span>

            <span className="text-xs text-[var(--blue-lvl2)]">
              Miracle center Junior Church 0-19 yrs
            </span>
          </h1>
        </div>
      </div>

    </div>
  );
};

export default Navbar;