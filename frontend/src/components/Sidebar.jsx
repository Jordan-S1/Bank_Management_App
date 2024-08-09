import React from "react";
import { NavLink } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useLogout } from "../hooks/useLogout";

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useLogout();

  const handleClick = () => {
    logout();
    onClose(); // Close the sidebar
  };
  return (
    <div
      className={
        " fixed inset-y-0 left-0 bg-violet-900 dark:bg-green-900 text-black transition-width duration-300 overflow-hidden z-20 " +
        (isOpen ? "w-56" : "w-0")
      }
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white">
        <IoClose size={24} />
      </button>
      <nav className="mt-20 flex flex-col space-y-4 text-justify text-white">
        <NavLink
          to="/"
          className="py-2 px-6 dark:hover:bg-green-700 hover:bg-violet-700 rounded"
          onClick={onClose}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/payments"
          className="py-2 px-6 dark:hover:bg-green-700 hover:bg-violet-700 rounded"
          onClick={onClose}
        >
          Payments
        </NavLink>
        <NavLink
          to="/transactions"
          className="py-2 px-6 dark:hover:bg-green-700 hover:bg-violet-700 rounded"
          onClick={onClose}
        >
          Transactions
        </NavLink>
        <button
          onClick={handleClick}
          className="text-white px-6 py-2 dark:hover:bg-green-700 hover:bg-violet-700 rounded flex items-center"
        >
          <FaSignOutAlt className="mr-2" />
          Log Out
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
