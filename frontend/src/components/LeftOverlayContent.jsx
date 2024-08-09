const LeftOverlayContent = ({ isAnimated, setIsAnimated }) => {
  return (
    <div className="p-8 text-center">
      <h1 className="text-6xl font-bold text-white mb-4">
        Already have an account ?
      </h1>

      <h5 className="text-xl text-white">Sign in with your email & password</h5>
      <div className="mt-16">
        <button
          className="py-3 px-6 bg-transparent rounded-full text-center text-white text-xl font-bold uppercase ring-2 ring-white active:scale-125 transition-transform ease-in duration-100 hover:scale-110"
          onClick={(e) => {
            setIsAnimated(false);
          }}
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default LeftOverlayContent;
