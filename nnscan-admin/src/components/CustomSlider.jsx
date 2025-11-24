import React, { useState } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";

const CustomSlider = () => {
  const [value, setValue] = useState(1);

  const handleChange = (e) => {
    setValue(parseInt(e.target.value));
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={12}>
          <div className="d-flex flex-column align-items-center">
            {/* Slider */}
            <Form.Range
              min={0}
              max={2}
              step={1}
              value={value}
              onChange={handleChange}
              className="w-100"
              style={{
                accentColor: "#007bff", // Bootstrap primary blue
              }}
            />

            {/* Labels */}
            <div className="d-flex justify-content-between w-100 mt-2 text-center fw-bold">
              <span
                className={`${
                  value === 0 ? "text-primary" : "text-secondary"
                }`}
              >
                LOW
              </span>
              <span
                className={`${
                  value === 1 ? "text-primary" : "text-secondary"
                }`}
              >
                MEDIUM
              </span>
              <span
                className={`${
                  value === 2 ? "text-primary" : "text-secondary"
                }`}
              >
                HIGH
              </span>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomSlider;
