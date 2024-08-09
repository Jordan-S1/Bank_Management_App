import React from "react";
import { NavLink } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Header = ({ onSidebarToggle, onLogout }) => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
    onLogout();
  };

  return (
    <header className="bg-violet-800 dark:bg-green-800 p-4 flex justify-between items-center">
      <nav className="flex items-center space-x-4 md:space-x-12">
        {user && (
          <button
            onClick={onSidebarToggle}
            className="text-white focus:outline-none"
          >
            <IoMenu className="size-8" />
          </button>
        )}
        <NavLink
          to="/"
          className="text-white text-xl sm:text-2xl font-bold flex items-center"
        >
          <img
            src="/coin.png"
            alt="Coin Icon"
            className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3"
          />
          Easy Finance
        </NavLink>
      </nav>
      <nav className="flex items-center space-x-2 sm:space-x-4">
        <ThemeToggle />
        {user ? (
          <>
            <div className="text-sm sm:text-lg text-white block px-2 sm:px-4 py-2 rounded flex items-center whitespace-nowrap">
              <FaUser className="mr-1 sm:mr-2 size-4 sm:size-5" />
              Welcome, {user.name}
            </div>
            <button
              onClick={handleClick}
              className="text-sm sm:text-lg text-white block px-2 sm:px-4 py-2 hover:text-violet-800 dark:hover:text-green-800 hover:bg-white rounded flex items-center whitespace-nowrap"
            >
              <FaSignOutAlt className="mr-1 sm:mr-2" />
              Log Out
            </button>
          </>
        ) : (
          <div className="flex space-x-2 sm:space-x-4">
            <NavLink
              to="/auth"
              className="text-sm sm:text-lg text-white block px-2 sm:px-4 py-2 hover:text-violet-800 dark:hover:text-green-800 hover:bg-white rounded"
              state={{ isAnimated: false }}
            >
              Login
            </NavLink>
            <NavLink
              to="/auth"
              className="text-sm sm:text-lg text-white block px-2 sm:px-4 py-2 hover:text-violet-800 dark:hover:text-green-800 hover:bg-white rounded"
              state={{ isAnimated: true }}
            >
              Signup
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
