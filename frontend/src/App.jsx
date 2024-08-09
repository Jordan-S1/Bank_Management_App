import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Credits from "./components/Credits";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Payments from "./pages/Payments";
import AuthPage from "./pages/AuthPage";

const App = () => {
  const { user } = useAuthContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen bg-gray-200 dark:bg-neutral-800">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-10"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col">
        <Header onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={!user ? <Home /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/auth"
              element={!user ? <AuthPage /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/payments"
              element={user ? <Payments /> : <Navigate to="/" />}
            />
            <Route
              path="/transactions"
              element={user ? <Transactions /> : <Navigate to="/" />}
            />
            <Route path="/credits" element={<Credits />} />
          </Routes>
        </main>
        {location.pathname === "/" && <Footer />}
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;
