import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

import useAuthUser from "./hooks/useAuthUser";
import Layout from "./components/Layout";
import PageLoader from "./components/PageLoader";
import { useThemeStore } from "./store/ThemeSelector";

// ✅ All pages imported normally (no lazy)
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OnBoardingPage from "./pages/OnBoardingPage";
import ChatPage from "./pages/ChatPage";
import CallPage from "./pages/CallPage";
import FriendsPage from "./pages/FriendsPage";
import NotificationsPage from "./pages/NotificationsPage";
import NotFoundPage from "./pages/NotFoundPage";



console.log("Frontend Stream Key:", import.meta.env.VITE_STREAM_API_KEY);

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeInOut" },
};

const App = () => {
  const { theme } = useThemeStore();
  const { authUser, isLoading } = useAuthUser();
  const location = useLocation();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnBoard;


  return (
    <div data-theme={theme} className="bg-white min-h-screen">
      <Toaster />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
          className="min-h-screen"
        >
          <Routes location={location}>
            <Route
              path="/"
              element={
                isAuthenticated && isOnboarded ? (
                  <Layout showSidebar>
                    <HomePage />
                  </Layout>
                ) : (
                  <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                )
              }
            />

            <Route
              path="/chat/:id"
              element={
                isAuthenticated && isOnboarded ? (
                  <Layout showSidebar={false}>
                    <ChatPage />
                  </Layout>
                ) : (
                  <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                )
              }
            />

            <Route
              path="/friends"
              element={
                isAuthenticated && isOnboarded ? (
                  <Layout showSidebar>
                    <FriendsPage />
                  </Layout>
                ) : (
                  <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                )
              }
            />
<Route
  path="/call/:id"
  element={
    isLoading ? (
      <PageLoader />
    ) : isAuthenticated && isOnboarded ? (
      <Layout showSidebar={false}>
        <CallPage />
      </Layout>
    ) : (
      <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
    )
  }
/>


            <Route
              path="/notification"
              element={
                isAuthenticated && isOnboarded ? (
                  <Layout showSidebar>
                    <NotificationsPage />
                  </Layout>
                ) : (
                  <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                )
              }
            />

            <Route
              path="/onboarding"
              element={
                isAuthenticated ? (
                  !isOnboarded ? (
                    <OnBoardingPage />
                  ) : (
                    <Navigate to="/" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/login"
              element={
                !isAuthenticated ? (
                  <LoginPage />
                ) : (
                  <Navigate to={isOnboarded ? "/" : "/onboarding"} />
                )
              }
            />

            <Route
              path="/register"
              element={
                !isAuthenticated ? (
                  <RegisterPage />
                ) : (
                  <Navigate to={isOnboarded ? "/" : "/onboarding"} />
                )
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;
