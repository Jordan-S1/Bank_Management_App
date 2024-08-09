import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="selection:bg-violet-500 dark:selection:bg-green-500 selection:text-white">
      <div className="flex justify-center items-center">
        <div className="p-8 flex-1">
          <div className="mx-auto">
            <h1 className="text-5xl font-bold text-violet-600 dark:text-green-600 whitespace-nowrap">
              Welcome back!
            </h1>

            <form className="mt-12" onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 dark:text-gray-100 placeholder-transparent focus:outline-none focus:border-violet-600 dark:focus:border-green-600 dark:bg-neutral-900"
                  placeholder="Email"
                />
                <label
                  htmlFor="login-email"
                  className="absolute left-0 -top-3.5 text-gray-600 dark:text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 dark:peer-focus:text-gray-300 peer-focus:text-sm"
                >
                  Email address
                </label>
              </div>
              <div className="mt-10 relative">
                <input
                  id="login-password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 dark:text-gray-100 placeholder-transparent focus:outline-none focus:border-violet-600 dark:focus:border-green-600 bg-white dark:bg-neutral-900"
                  placeholder="Password"
                />
                <label
                  htmlFor="login-password"
                  className="absolute left-0 -top-3.5 text-gray-600 dark:text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 dark:peer-focus:text-gray-300 peer-focus:text-sm"
                >
                  Password
                </label>
              </div>

              <button
                disabled={isLoading}
                className="mt-14 px-8 py-4 uppercase rounded-full bg-violet-600 hover:bg-violet-500 dark:bg-green-600 dark:hover:bg-green-500 text-white font-semibold text-center block w-full focus:outline-none focus:ring focus:ring-offset-2 focus:ring-violet-500 dark:focus:ring-green-600 focus:ring-opacity-80 cursor-pointer"
              >
                Log in
              </button>
              {error && (
                <div className="mt-4 mb-6 px-2 py-1 bg-red-100 text-red-600 border border-red-600 rounded">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
