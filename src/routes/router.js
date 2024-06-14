import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Editor } from "../components/Builder/Index";
import Dashboard from "../components/Dashboard";
import Error from "../components/Error/Error";
import Login from "../components/Login";
import Logout from "../components/Logout/logout";
import ListProfiles from "../components/Profile/List";
import ProtectedRoutes from "./ProtectedRoutes";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/profiles"
          element={<ProtectedRoutes Component={ListProfiles} />}
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoutes Component={Dashboard} />}
        />
        <Route
          path="/profile-builder"
          element={<ProtectedRoutes Component={Editor} />}
        />
        <Route
          path="/logout"
          element={<ProtectedRoutes Component={Logout} />}
        />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
