import React from "react";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className="relative p-4 md:p-10 min-h-screen bg-home-bg bg-cover bg-center flex flex-col md:flex-row items-center">
      <div className="text-center md:text-left w-full md:w-2/5">
        <h1 className="text-3xl md:text-4xl font-bold text-black">
          Easy Finance
        </h1>
        <p className="mt-4 text-base md:text-lg text-black font-light">
          Welcome to Easy Finance, your reliable partner in managing your
          banking needs. We offer a range of services to help you manage your
          finances with ease and convenience.
        </p>
        <div className="mt-8 md:mt-12 flex flex-col md:flex-row justify-center md:justify-start space-y-4 md:space-y-0 md:space-x-4 text-lg text-white font-medium whitespace-nowrap">
          <NavLink
            to="/auth"
            className="bg-blue-500 hover:bg-blue-700 py-3 px-8 md:py-4 md:px-12 rounded shadow-xl transition ease-in duration-200"
            state={{ isAnimated: true }}
          >
            Sign Up
          </NavLink>
          <NavLink
            to="/auth"
            className="bg-orange-500 hover:bg-orange-700 py-3 px-8 md:py-4 md:px-12 rounded shadow-xl transition ease-in duration-200"
            state={{ isAnimated: false }}
          >
            Log In
          </NavLink>
        </div>
      </div>
      <div className="relative md:absolute right-0 bottom-0 w-full md:w-1/2 mt-8 h-full">
        <img
          src="/bank_building.jpg"
          alt="Bank"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default Home;
