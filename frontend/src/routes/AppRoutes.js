import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import SocialLoginSuccess from "../pages/SocialLoginSuccess";
import Home from "../pages/Home";
import PageTransition from "../components/PageTransition";
import Users from "../components/Users";
import Roles from "../components/Roles";
import Skills from "../components/Skills";
import Profile from "../pages/Profile";
import Volunteers from "../pages/Volunteers";


function AnimatedRoutes({ token }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />

        <Route path="/users" element={<Users />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/volunteers" element={<Volunteers />} />
        
        <Route
          path="/login"
          element={
            !token ? (
              <PageTransition>
                <Login />
              </PageTransition>
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/social-success"
          element={
            <PageTransition>
              <SocialLoginSuccess />
            </PageTransition>
          }
        />

        <Route
          path="/dashboard"
          element={
            token ? (
              <PageTransition>
                <Dashboard />
              </PageTransition>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function AppRoutes() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const checkToken = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkToken);
    checkToken();

    return () => window.removeEventListener("storage", checkToken);
  }, []);

  return (
    <BrowserRouter>
      <AnimatedRoutes token={token} />
    </BrowserRouter>
  );
}

export default AppRoutes;