import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const index = () => {
  return !localStorage.getItem("email") ? <Outlet /> : <Navigate to={"/"} />;
};

export default index;
