import React from "react";
import NavBar from "@/components/navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}