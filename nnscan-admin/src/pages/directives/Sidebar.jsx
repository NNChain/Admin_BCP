import React, { useState } from "react";
import { Offcanvas, Nav, Button, NavDropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { Menu, Home, Shield, Repeat } from "lucide-react";
import { MdControlCamera } from "react-icons/md";
import { RiTokenSwapLine } from "react-icons/ri";
import { RiNftLine } from "react-icons/ri";
import { GoListUnordered } from "react-icons/go";
import { MdOutlineLogout } from "react-icons/md";
import { SiBlockchaindotcom } from "react-icons/si";
import logo1 from "../../assets/logo1.svg";

const Sidebar = ({ show, handleClose }) => {
  const location = useLocation();

  // const isActive = (path) => location.pathname === path;
  const isActive = (paths) => {
  if (Array.isArray(paths)) {
    return paths.some((path) => location.pathname.startsWith(path));
  }
  return location.pathname.startsWith(paths);
};

  const navItemStyle = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontWeight: "600",
    padding: "10px 14px",
    borderRadius: "12px",
    transition: "0.25s",
    background: active ? "#fff8eeff" : "transparent",
    borderLeft: active ? "4px solid #e2b24aff" : "4px solid transparent",
    color: active ? "#8a641eff" : "#514937ff",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    // no navigate() here — Link will navigate
  };

  return (
    <>
      {/* Mobile Hamburger */}

      {/* Mobile Sidebar */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        responsive="md"
        backdrop
        className="bg-white border-end shadow-sm"
      >
        <Offcanvas.Header closeButton>
          <img
            src={logo1}
            alt="nnscan logo"
            className="w-50"
          />
        </Offcanvas.Header>

        <Offcanvas.Body className="px-3">
          <Nav className="flex-column gap-2 mt-3">
            <Nav.Link
              as={Link}
              to="/dashboard"
              style={navItemStyle(isActive("/dashboard"))}
            >
              <Home size={18} /> Dashboard
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/validator-control"
              style={navItemStyle(isActive("/validator-control"))}
            >
              <MdControlCamera size={18} />
              Validator Control
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/token-controls"
              style={navItemStyle(isActive("/token-controls"))}
            >
              <RiTokenSwapLine size={18} />
              Token Controls
            </Nav.Link>
            <Nav.Link
  as={Link}
  to="/minting"
  style={navItemStyle(isActive(["/minting", "/minting/:id"]))}
>
  <RiNftLine size={18} />
  NFT
</Nav.Link>

            <Nav.Link
              as={Link}
              to="/listing-validator"
              style={navItemStyle(isActive("/listing-validator"))}
            >
              <GoListUnordered size={18} />
              Validator Listing
            </Nav.Link>
            <Nav.Link
              as={Link}
              onClick={handleLogout}
              // style={navItemStyle(isActive("/"))}
            >
              <MdOutlineLogout size={18} />
              Logout
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Desktop Fixed Sidebar */}
      <div
        className="bg-white border-end shadow-sm d-none d-md-flex flex-column"
        style={{
          width: "260px",
          minHeight: "100vh",
          position: "fixed",
          padding: "20px 16px",
        }}
      >
        <img
       src={logo1}
          alt="nnscan logo"
          className="w-75 mx-auto mb-4 mt-2"
        />

        <Nav className="flex-column gap-2">
          <Nav.Link
            as={Link}
            to="/dashboard"
            style={navItemStyle(isActive("/dashboard"))}
          >
            <Home size={18} /> Dashboard
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/validator-control"
            style={navItemStyle(isActive("/validator-control"))}
          >
            <MdControlCamera size={18} />
            Validator Control
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/token-controls"
            style={navItemStyle(isActive("/token-controls"))}
          >
            <RiTokenSwapLine size={18} />
            Token Controls
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/minting"
            style={navItemStyle(isActive("/minting"))}
          >
            <RiNftLine size={18} />
            NFT
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/listing-validator"
            style={navItemStyle(isActive("/listing-validator"))}
          >
            <GoListUnordered size={18} />
            Validator Listing
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/chain-data"
            style={navItemStyle(isActive("/chain-data"))}
          >
            
            <SiBlockchaindotcom size={18} />
            Chain Data
          </Nav.Link>

          <Nav.Link
            as={Link}
            to="/"
            onClick={handleLogout}
            style={navItemStyle(isActive("/a"))}
          >
            <MdOutlineLogout size={18} />
            Logout
          </Nav.Link>

          {/* <NavDropdown title="Blockchain" className="modern-dd">
            <NavDropdown.Item 
              as={Link} 
              to="/transactions"
              className="modern-dd-item"
            >
              <Repeat size={17} /> Transactions
            </NavDropdown.Item>
            <NavDropdown.Item 
              as={Link} 
              to="/validators"
              className="modern-dd-item"
            >
              <Shield size={17} /> Validators
            </NavDropdown.Item>
          </NavDropdown> */}
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;
