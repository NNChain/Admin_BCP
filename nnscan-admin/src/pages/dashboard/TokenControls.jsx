import React, { useState } from "react";
import CustomChart from "../../components/CustomChart";
import Header from "../directives/Header";
import { Button, Col, Form, ProgressBar, Row } from "react-bootstrap";
import CustomSlider from "../../components/CustomSlider";
import "../../styles/Home.css";
import DataTable from "react-data-table-component";
import CustomNavigate from "../directives/CustomNavigate";

const TxFeeSlider = () => {
  const [value, setValue] = useState(50);
  const updateTrack = (e) => {
    const val = e.target.value;
    e.target.style.setProperty("--value", `${val}%`);
  };
  return (
    <div className="d-flex align-items-center justify-content-center gap-3 w-100">
      <p className="fw-bold mb-0" style={{ width: 50 }}>
        MIN
      </p>

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

      <p className="fw-bold mb-0" style={{ width: 50 }}>
        MAX
      </p>
    </div>
  );
};

const TokenControls = () => {
  const columns = [
    {
      name: 'Token Name',
      selector: row => (
        <p className='type-font'>{row.token}</p>
      ),
    },
    {
      name: 'Minting Enabled',
      selector: row => (
        <div  style={{width:100}} className=" py-2 ps-3" >
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
      name: 'Circulation ',
        cell: (row) =>(
        <p className='type-font'>{row.circulation}</p>
      ),
      
    },
    {
      name: 'Mint ',
       cell: (row) => (
          <div style={{backgroundColor:"#D7B44280",width:"fit-content",borderRadius:"5px", fontWeight:700 }} className='px-4 py-2 '>
          {row.mint}
          </div>
        ),
      
    },
    {
      name: 'Action ',
        cell: (row) => (
          <div style={{backgroundColor:"#42D74E7A",width:"fit-content",borderRadius:"5px", textTransform:"capitalize", fontWeight:700 }} className='px-4 py-2 '>
          {row.action}
          </div>
        ),
      
    },
  ];
  
  const data = [
      {
      id: 1,
      token: 'NNC',
      active: 'true',
      circulation: '1,000,000,000',
      mint: '1,000,000',
      action: 'approved',
    },
    {
      id: 2,
      token: 'NUSD',
      active: 'true',
      circulation: '5,000,000',
      mint: '1,000,000',
      action: 'approved',
    },
    {
      id: 3,
       token: 'NSAR',
      active: 'true',
      circulation: '5,000,000',
      mint: '1,000,000',
      action: 'approved',
    },
    {
      id: 4,
       token: 'NCHY',
      active: 'true',
      circulation: '5,000,000',
      mint: '1,000,000',
      action: 'approved',
    },
    {
      id: 5,
       token: 'NEUR',
      active: 'true',
      circulation: '5,000,000',
      mint: '1,000,000',
      action: 'approved',
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
      fontSize:"22px",
      fontWeight:700
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
    { id: 3, symbol: "NSAR" },
    { id: 4, symbol: "NCHY" },
    { id: 5, symbol: "NEUR" },
  ]

  const marketplace = [
    { id: 1, name: "NNC Price" , price:"$465.23",change:"+0.256%"},
    { id: 2, name: "NNC Price" , price:"$465.23",change:"+0.256%"},
    { id: 3, name: "NNC Price" , price:"$465.23",change:"+0.256%"},
    { id: 4, name: "NNC Price" , price:"$465.23",change:"+0.256%"},
    { id: 5, name: "NNC Price" , price:"$465.23",change:"+0.256%"},
  ]

  return (
    <>
      <Header />
<div className=" px-sm-4 px-2">

      <CustomChart />
          <h5 className="mb-1 nnhead my-4 text-center fw-700 fs-24">Token Control - NNChain </h5>
      <section className="my-4 w-100  px-3 mt-5">
        <div className="d-flex align-items-center  gap-3 mb-4 flex-grow-1">
          <h5 className="mb-1 nnhead fw-700">Transfers : </h5>
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
          <Button variant="primary" className="ms-sm-auto ms-0">
           Load More
          </Button>
        </div>
      
      </section>

         <section className="my-4 w-100  px-3 mt-5">
             <div className="d-flex turn align-items-center gap-3 mb-4 flex-wrap flex-grow-1 w-100">
          <h5 className="mb-1 nnhead fw-700">Transfers : </h5>
            <Row className="w-100 gy-3 flex-wrap ">
                {marketplace.map((marketplace, index) => (
                <Col xl={3} lg={4} md={6} sm={6} key={index}>

                 <div className="box ">
                <img src="assets/images/nncoin.png" className="img-fluid" style={{height:40}} alt="" />
                <div>
                    <h5 className="mb-1 nnhead" >{marketplace.name}</h5>
                    <h5 style={{fontWeight:"700"}} className="mb-1 nnhead">{marketplace.price}</h5>
                </div>
                <div>
                    <p>+0.256%</p>
                </div>
            </div>
                </Col>
                ))}
            </Row>
          </div>
         </section>

      <section className=" mt-5 px-3">
        <h5 className="mb-4 nnhead fw-700">Minting Control:  </h5>
        <DataTable columns={columns} data={data} customStyles={customStyles} />
      </section>
</div>
    
    </>
  );
};

export default TokenControls;
