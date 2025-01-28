import React, { useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Home/Dashboard";
import Profile from "./pages/Home/Profile";
import Feed from "./pages/Home/Feed";
import LoaderSvg from "./utils/svg/LoaderSvg";

import { fetchUser } from "./redux/Home/userSlice";
import UpdateProfile from "./pages/UpdateProfile";

function ProtectedRoute({ children }) {
  const { data } = useSelector((state) => state.user);

  if (!data) return <Navigate to="/login" />;
  return children;
}

function App() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (loading)
    return (
      <div className="w-screen h-screen bg-slate-900 flex justify-center items-center">
        <LoaderSvg />
      </div>
    );

  return (
    <Routes>
      <Route path="/login" element={!data ? <Login /> : <Navigate to="/" />} />
      <Route
        path="/signup"
        element={!data ? <SignUp /> : <Navigate to="/" />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path="/update" element={<UpdateProfile />} />
        <Route index element={<Feed />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
