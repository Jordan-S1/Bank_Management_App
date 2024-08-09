import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white text-xs text-violet-500 dark:text-green-500 py-4 dark:bg-neutral-800 font-medium">
      <div className="container mx-auto text-center">
        <NavLink to="/credits" className=" hover:underline">
          Credits
        </NavLink>
      </div>
    </footer>
  );
};

export default Footer;
