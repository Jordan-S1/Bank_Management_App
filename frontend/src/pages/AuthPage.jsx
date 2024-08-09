import { useState } from "react";
import { useLocation } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import LeftOverlayContent from "../components/LeftOverlayContent";
import RightOverlayContent from "../components/RightOverlayContent";

const AuthPage = () => {
  const location = useLocation();
  const [isAnimated, setIsAnimated] = useState(
    location.state?.isAnimated || false
  );

  const overlayBg =
    "bg-gradient-to-r from-indigo-800 via-purple-800 to-indigo-800";
  const overlayBgDark =
    "dark:bg-gradient-to-r dark:from-green-700 dark:via-lime-700 dark:to-green-700";

  return (
    <div className="h-full w-full bg-white dark:bg-neutral-900 relative overflow-hidden">
      <div
        className={`bg-white dark:bg-neutral-900 absolute top-0 left-0 h-full w-1/2 flex justify-center items-center transition-all duration-700 ease-in-out z-20 ${
          isAnimated ? "translate-x-full opacity-0" : ""
        }`}
      >
        <Login />
      </div>

      <div
        className={`absolute top-0 left-0 h-full w-1/2 flex justify-center items-center transition-all duration-700 ease-in-out ${
          isAnimated
            ? "translate-x-full opacity-100 z-50 animate-show"
            : "opacity-0 z-10"
        }`}
      >
        <div className="h-full w-full flex justify-center items-center">
          <Signup />
        </div>
      </div>

      <div
        id="overlay-container"
        className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition transition-transform duration-700 ease-in-out z-100 ${
          isAnimated ? "-translate-x-full" : ""
        }`}
      >
        <div
          id="overlay"
          className={`${overlayBg} ${overlayBgDark} relative -left-full h-full w-[200%] transform transition transition-transform duration-700 ease-in-out ${
            isAnimated ? "translate-x-1/2" : "translate-x-0"
          }`}
        >
          <div
            id="overlay-left"
            className={`w-1/2 h-full absolute flex justify-center items-center top-0 transform -translate-x-[20%] transition transition-transform duration-700 ease-in-out ${
              isAnimated ? "translate-x-0" : "-translate-x-[20%]"
            }`}
          >
            <LeftOverlayContent
              isAnimated={isAnimated}
              setIsAnimated={setIsAnimated}
            />
          </div>
          <div
            id="overlay-right"
            className={`w-1/2 h-full absolute flex justify-center items-center top-0 right-0 transform transition transition-transform duration-700 ease-in-out ${
              isAnimated ? "translate-x-[20%]" : "translate-x-0"
            }`}
          >
            <RightOverlayContent
              isAnimated={isAnimated}
              setIsAnimated={setIsAnimated}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
