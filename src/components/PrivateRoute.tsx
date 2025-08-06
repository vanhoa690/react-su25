import React from "react";
import { Outlet } from "react-router-dom";
import AccessDenied from "./AccessDenied";

const PrivateRoute: React.FC = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <AccessDenied />;
};

export default PrivateRoute;
