import React from 'react'
import { Col, Row } from 'react-bootstrap'

const Shimmer = ({index}) => {
  return (
    <>
    <Row>
       <Col key={index} xl={3} lg={4} md={6} sm={6} className="mb-4 h-100">
        <div className="shimmer-card">
          <div className="shimmer-img shimmer"></div>
          <div className="shimmer-line shimmer w-75 mx-auto mt-3"></div>
          <div className="shimmer-line shimmer w-50 mx-auto mt-2"></div>
          <div className="shimmer-line shimmer w-25 mx-auto mt-2"></div>
        </div>
      </Col>
       <Col key={index} xl={3} lg={4} md={6} sm={6} className="mb-4 h-100">
        <div className="shimmer-card">
          <div className="shimmer-img shimmer"></div>
          <div className="shimmer-line shimmer w-75 mx-auto mt-3"></div>
          <div className="shimmer-line shimmer w-50 mx-auto mt-2"></div>
          <div className="shimmer-line shimmer w-25 mx-auto mt-2"></div>
        </div>
      </Col>
       <Col key={index} xl={3} lg={4} md={6} sm={6} className="mb-4 h-100">
        <div className="shimmer-card">
          <div className="shimmer-img shimmer"></div>
          <div className="shimmer-line shimmer w-75 mx-auto mt-3"></div>
          <div className="shimmer-line shimmer w-50 mx-auto mt-2"></div>
          <div className="shimmer-line shimmer w-25 mx-auto mt-2"></div>
        </div>
      </Col>
       <Col key={index} xl={3} lg={4} md={6} sm={6} className="mb-4 h-100">
        <div className="shimmer-card">
          <div className="shimmer-img shimmer"></div>
          <div className="shimmer-line shimmer w-75 mx-auto mt-3"></div>
          <div className="shimmer-line shimmer w-50 mx-auto mt-2"></div>
          <div className="shimmer-line shimmer w-25 mx-auto mt-2"></div>
        </div>
      </Col>
     </Row>
    </>
  )
}

export default Shimmer