import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import CustomChart from "../../components/CustomChart";
import Header from "../directives/Header";
import CustomSlider from "../../components/CustomSlider";
import DataTable from "react-data-table-component";
import CustomNavigate from "../directives/CustomNavigate";

const ValidatorControl = () => {
  const columns = [
    {
      name: "Type",
      selector: (row) => <p className="type-font">{row.type}</p>,
    },
    {
      name: "Active",
      selector: (row) => (
        <div style={{ width: 100 }} className=" py-2 ps-3">
          <Form>
            <Form.Check // prettier-ignore
              type="switch"
              id="custom-switch"
              // label="Check this switch"
            />
          </Form>
        </div>
      ),
    },
    {
      name: "Max Qty ",
      cell: (row) => row.maxqty,
    },
    {
      name: "Mint ",
      cell: (row) => (
        <div>
          <Form.Control
            style={{
              backgroundColor: "#D7B44280",
              width: "fit-content",
              borderRadius: "5px",
              fontWeight: 700,
            }}
            className="px-4 py-2 "
            type="text"
            id=""
          />
        </div>
      ),
    },
    {
      name: "Action ",
      cell: (row) => (
        <div
          style={{
            backgroundColor: "#42D74E7A",
            width: "fit-content",
            borderRadius: "5px",
            fontWeight: 700,
          }}
          className="px-4 py-2 "
        >
          {row.action}
        </div>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      type: "Type I",
      active: "true",
      maxqty: "50",
      mint: "true",
      action: "0.01 NNC",
    },
    {
      id: 2,
      type: "Type II",
      active: "true",
      maxqty: "486",
      mint: "true",
      action: "0.01 NNC",
    },
    {
      id: 3,
      type: "Type III",
      active: "true",
      maxqty: "8625",
      mint: "true",
      action: "0.01 NNC",
    },
  ];
  const customStyles = {
    rows: {
      style: {
        minHeight: "72px", // override the row height
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
        fontSize: "22px",
        fontWeight: 700,
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
    
  };
  return (
    <>
      <Header />

      <div className=" px-4">
        <Container fluid className="nnmain py-4">
          <Row className="gy-3">
            <Col
              lg={4}
              md={4}
              sm={6}
              className="d-flex flex-column justify-content-center align-items-center"
            >
              <div className="box  mb-3 px-3">
                <img
                  src="assets/images/nncoin.png"
                  className="img-fluid"
                  style={{ height: 40 }}
                  alt=""
                />
                <div>
                  <h6 className="mb-1 nnhead">Type I Price</h6>
                  <h3 style={{ fontWeight: "700" }} className="mb-1 nnhead">
                    $10K
                  </h3>
                </div>
              </div>
              <img
                src="assets/images/icons/coin1.svg"
                className="img-fluid coinimage"
                alt=""
              />
               <div className="box text-center  mt-3 px-4">
                <div>
                  <h6 className="mb-1 nnhead">Validator Marketcap</h6>
                  <h2 style={{ fontWeight: "700" }} className="mb-1 nnhead">
                    $1M
                  </h2>
                </div>
              </div>
            </Col>
            <Col
              lg={4}
              md={4}
              sm={6}
              className="d-flex flex-column justify-content-center align-items-center"
            >
              <div className="box   mb-3 px-3">
                <img
                  src="assets/images/nncoin.png"
                  className="img-fluid"
                  style={{ height: 40 }}
                  alt=""
                />
                <div >
                  <h6 className="mb-1 nnhead">Type II Price</h6>
                  <h3 style={{ fontWeight: "700" }} className="mb-1 nnhead">
                    $20K
                  </h3>
                </div>
              </div>
              <img
                src="assets/images/icons/coin2.svg"
                className="img-fluid coinimage"
                alt=""
              />
                <div className="box text-center  mt-3 px-4">
                <div>
                  <h6 className="mb-1 nnhead">Validator Marketcap</h6>
                  <h2 style={{ fontWeight: "700" }} className="mb-1 nnhead">
                    $1M
                  </h2>
                </div>
              </div>
            </Col>
            <Col
              lg={4}
              md={4}
              sm={6}
              className="d-flex flex-column justify-content-center align-items-center"
            >
              <div className="box  mb-3 px-3">
                <img
                  src="assets/images/nncoin.png"
                  className="img-fluid"
                  style={{ height: 40 }}
                  alt=""
                />
                <div>
                  <h6 className="mb-1 nnhead">Type III Price </h6>
                  <h3 style={{ fontWeight: "700" }} className="mb-1 nnhead">
                    $30k
                  </h3>
                </div>
              </div>
              <img
                src="assets/images/icons/coin3.svg"
                className="img-fluid coinimage"
                alt=""
              />
              <div className="box text-center  mt-3 px-4">
                <div>
                  <h6 className="mb-1 nnhead">Validator Marketcap</h6>
                  <h2 style={{ fontWeight: "700" }} className="mb-1 nnhead">
                    $1M
                  </h2>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <section className="my-4  w-100   px-3">
          <h5 className="mb-1 text-center fw-700 fs-24">Validator Control</h5>

          <div className="transfer">
            <h4 className="mb-1 fw-700 ">Transfers:</h4>
            <Row className="gy-3">
              <Col
                lg={4}
                md={4}
                sm={6}
                xs={4}
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <img
                  src="assets/images/icons/coin1.svg"
                  className=" coinimage2"
                  alt=""
                />
                <p className="type-font mt-1">Type 1</p>
                <Form>
                  <Form.Check // prettier-ignore
                    type="switch"
                    id="custom-switch"
                  />
                </Form>
              </Col>
              <Col
                lg={4}
                md={4}
                sm={6}
                xs={4}
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <img
                  src="assets/images/icons/coin2.svg"
                  className=" coinimage2"
                  alt=""
                />
                <p className="type-font mt-1">Type 2</p>
                <Form>
                  <Form.Check // prettier-ignore
                    type="switch"
                    id="custom-switch"
                  />
                </Form>
              </Col>
              <Col
                lg={4}
                md={4}
                sm={6}
                xs={4}
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <img
                  src="assets/images/icons/coin3.svg"
                  className=" coinimage2"
                  alt=""
                />
                <p className="type-font mt-1">Type 3</p>
                <Form>
                  <Form.Check // prettier-ignore
                    type="switch"
                    id="custom-switch"
                  />
                </Form>
              </Col>
            </Row>
          </div>
          <div className="transfer mt-4">
            <h4 className="mb-1 fw-700">Staking Rewards: </h4>
            <Row className="gy-3">
              <Col
                lg={4}
                md={4}
                sm={4}
                xs={4}
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <img
                  src="assets/images/icons/coin1.svg"
                  className="coinimage2"
                  alt=""
                />
                <p className="type-font mt-1">Type 1</p>
                <p className="type-font mt-1 fs-24">5%</p>
              </Col>
              <Col
                lg={4}
                md={4}
                sm={4}
                xs={4}
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <img
                  src="assets/images/icons/coin2.svg"
                  className="coinimage2"
                  alt=""
                />
                <p className="type-font mt-1">Type 2</p>
                <p className="type-font mt-1 fs-24">7%</p>
              </Col>
              <Col
                lg={4}
                md={4}
                sm={4}
                xs={4}
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <img
                  src="assets/images/icons/coin3.svg"
                  className="coinimage2"
                  alt=""
                />
                <p className="type-font mt-1">Type 3</p>
                <p className="type-font mt-1 fs-24">10%</p>
              </Col>
            </Row>
          </div>
        </section>

        <section className=" my-4 px-3">
          <h5 className="mb-1 nnhead fw-700">Minting Control: </h5>
          <DataTable
            customStyles={customStyles}
            columns={columns}
            data={data}
          />
        </section>
      </div>
    </>
  );
};

export default ValidatorControl;
