import React, { useState } from "react";
import CustomChart from "../../components/CustomChart";
import Header from "../directives/Header";
import { Col, Form, ProgressBar, Row } from "react-bootstrap";
import CustomSlider from "../../components/CustomSlider";
import "../../styles/Home.css";
import DataTable from 'react-data-table-component';
import CustomNavigate from "../directives/CustomNavigate";

const TxFeeSlider = () => {
  const [value, setValue] = useState(50);
  const updateTrack = (e) => {
    const val = e.target.value;
    e.target.style.setProperty("--value", `${val}%`);
  };
  return (
    <div className="d-flex align-items-center justify-content-center gap-3 w-100">
      <p className="fw-bold mb-0" style={{ width: 50 }}>MIN</p>

      <div className="slider-container flex-grow-1">
        <Form.Range
          min={0}
          max={100}
          value={value}
          onChange={(e) => {
            setValue(Number(e.target.value));
            updateTrack(e);
          }}
          className="custom-slider"
        />
      </div>

      <p className="fw-bold mb-0" style={{ width: 50 }}>MAX</p>

    </div>
  );
};

const Home = () => {
  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
    },
    {
      name: 'Enabled',
      selector: () => (
        <div style={{ width: 100 }} className=" py-2 ps-3" >
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
      name: 'Tx Fee ',
      cell: () => <TxFeeSlider />,
      minWidth: "300px"
    },
  ];

  const data = [
    {
      id: 1,
      name: 'Beetlejuice',
      enable: 'true',
      txfee: '0.01 NNC',
    },
    {
      id: 2,
      name: 'Ghostbusters',
      enable: 'false',
      txfee: '0.02 NNC',
    },
    {
      id: 3,
      name: 'Ghostbusters',
      enable: 'true',
      txfee: '0.02 NNC',
    },
    {
      id: 4,
      name: 'Ghostbusters',
      enable: 'true',
      txfee: '0.02 NNC',
    },
    {
      id: 5,
      name: 'Ghostbusters',
      enable: 'false',
      txfee: '0.02 NNC',
    },
  ]

  const customStyles = {
    rows: {
      style: {
        minHeight: '72px', // override the row height
      },
    },
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px',
        fontSize: "22px",
        fontWeight: 700
      },
    },
    cells: {
      style: {
        paddingLeft: '8px', // override the cell padding for data cells
        paddingRight: '8px',
      },
    },
  };

  const token = [
    { id: 1, symbol: "NNC" },
    { id: 2, symbol: "NUSD" },

  ]

  return (
    <>
      <Header />

      <div className=" px-4">
        <CustomChart />

        <section className="my-4 d-flex w-100 justify-content-between flex-wrap mt-4  gap-4 px-3">

          <div className="w-100 text-center">
            <h3>Transactional Handling</h3>
          </div>

          <Row className="w-100">
            <Col lg={6}>
              <div className="d-flex align-items-center turn gap-3 mb-4 flex-grow-1">
                <h5 className="mb-1 nnhead fw-700">Gas Token: </h5>
                <div className="d-flex gap-4 flex-wrap gap-3">
                  {token.map((token, index) => (
                    <div key={index}>

                      <div className="d-flex flex-column gap-1  justify-content-center align-items-center">
                        <img
                          src="assets/images/nncoin.png"
                          style={{ height: 50, width: 50 }}
                          alt=""
                        />
                        <p style={{ fontSize: 12, fontWeight: 700 }} className="mb-0">
                          {token.symbol}
                        </p>
                        <Form>
                          <Form.Check // prettier-ignore
                            type="switch"
                            id="custom-switch"
                          />
                        </Form>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </Col>
            <Col lg={6}>
              <div className=" text-center ">
                <h5 className="mb-1 nnhead fw-700">Gas Severity:  </h5>
                <div className="">
                  <CustomSlider />
                </div>
              </div>
            </Col>
          </Row>


        </section>

        <section className="calculation  px-3">
          <h5 className="mb-1 nnhead fw-700">Gas Calculation: </h5>
          <div className="calculation2 my-4">
            <div className="text-center">

              <div className="box px-4 mb-3 ">
                <input type="text" placeholder="0.01 NNC" className="custom-input" />

                <div className="line"></div>
                <p className="my-2">0.01 NNC </p>
              </div>

              <p style={{ fontWeight: 700 }}>Minimum Gas per Txn</p>
            </div>
            <div className="text-center">

              <div className="box px-4 mb-3">
                <input type="text" placeholder="0.01 NNC" className="custom-input" />
                <div className="line"></div>
                <p className="my-2">0.01 NNC </p>
              </div>
              <p style={{ fontWeight: 700 }}>Minimum Gas per Txn</p>
            </div>
          </div>
        </section>

        <section className=" px-3 ">
          <h5 className="mb-1 nnhead fw-700 fs-24">Smart Contracts Execution: </h5>
          <DataTable customStyles={customStyles}
            columns={columns}
            data={data}
          />
        </section>
        <section className="calculation  px-3 my-4">
          <h5 className="mb-1 nnhead fw-700">Gas Calculation: </h5>
          <div className="calculation2 my-4">
            <div className="text-center">

              <div className="box px-4 mb-3 ">
                <input type="text" placeholder="0.01 NNC" className="custom-input" />

                <div className="line"></div>
                <p className="my-2">0.01 NNC </p>
              </div>

              <p style={{ fontWeight: 700 }}>Minimum Gas per Txn</p>
            </div>
            <div className="text-center">

              <div className="box px-4 mb-3">
                <input type="text" placeholder="0.01 NNC" className="custom-input" />
                <div className="line"></div>
                <p className="my-2">0.01 NNC </p>
              </div>
              <p style={{ fontWeight: 700 }}>Minimum Gas per Txn</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
