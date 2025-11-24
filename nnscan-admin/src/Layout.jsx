import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import Sidebar from "./pages/directives/Sidebar";

const Layout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="d-flex">
      <Sidebar show={showSidebar} handleClose={() => setShowSidebar(false)} />

      {/* Toggle button for mobile */}
      <Button
        variant="dark"
        className={`d-md-none m-2 ${showSidebar === true ? "d-none" : ""}`}
        onClick={() => setShowSidebar(true)}
        style={{ position: "fixed", top: "10px", left: "10px", zIndex: 2000 }}
      >
        <FaBars size={20} />
      </Button>

      {/* Content Area */}
      <div
        className="flex-grow-1 ps-sm-4 ps-0 pe-0  content-area"
        style={{ width: "100%" }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
