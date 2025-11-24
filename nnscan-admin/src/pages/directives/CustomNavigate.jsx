import React from "react";
import { Row, Col } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const CustomNavigate = () => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "NNC Price and Smart Contracts" },
    { path: "/validator-control", label: "Validator Control" },
    { path: "/token-controls", label: "Token Controls" },
    { path: "/minting", label: "NFT" },
    { path: "/listing-validator", label: "Listing Validator" },
  ];

  return (
    <Row className="g-3 my-4 justify-content-center nav-toggle-row py-2 custom-navigate">
      {navItems.map((item) => (
        <Col
          key={item.path}
          xs="auto"
          className={`nav-toggle ${
            location.pathname === item.path ? "active" : ""
          }`}
        >
          <Link to={item.path}>{item.label}</Link>
        </Col>
      ))}
    </Row>
  );
};

export default CustomNavigate;
