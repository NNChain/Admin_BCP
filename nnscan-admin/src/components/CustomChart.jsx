import React, { useState, useRef, useEffect } from "react";
import { Card, Container, Row, Col, ButtonGroup, Button } from "react-bootstrap";
import '../styles/CustomCharts.css';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend
);

const CustomChart = () => {
  const chartRef = useRef(null);
  const [selectedRange, setSelectedRange] = useState("24H");


  const [chartInfo, setChartInfo] = useState(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    setLoading(true);
    setChartInfo(null);

    setTimeout(() => {
      setChartInfo({
        price: "$465.23",
        percentageChange: "+0.256%",
        lastUpdated: "Just now",
      });
      setLoading(false);
    }, 1500);
  }, [selectedRange]);

  const chartData = {
    "24H": [430, 440, 420, 460, 455, 470, 465, 460, 450, 440],
    "7D": [480, 460, 450, 470, 465, 490, 480],
    "1M": [420, 460, 430, 450, 470, 440, 430, 420, 410, 400, 390, 380],
    "3M": [410, 400, 420, 460, 430, 410, 390, 370, 400, 420, 450, 430],
    "1Y": [460, 440, 420, 410, 390, 400, 420, 430, 410, 390, 380, 370],
    Max: [300, 320, 340, 360, 390, 420, 440, 470, 450, 430, 410, 390],
  };

  const labels = {
    "24H": ["1h", "3h", "5h", "7h", "9h", "11h", "13h", "15h", "17h", "19h"],
    "7D": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "1M": ["Week 1", "Week 2", "Week 3", "Week 4"],
    "3M": ["Jan", "Feb", "Mar"],
    "1Y": ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
    Max: ["2019", "2020", "2021", "2022", "2023", "2024"],
  };

  const data = {
    labels: labels[selectedRange],
    datasets: [
      {
        label: "NNC",
        data: chartData[selectedRange],
        borderColor: "#ff3333",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, "rgba(255, 0, 0, 0.5)");
          gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
          return gradient;
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111",
        titleColor: "#fff",
        bodyColor: "#fff",
        displayColors: false,
      },
    },
    scales: {
      x: {
        ticks: { color: "#aaa" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#aaa" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  const ranges = ["24H", "7D", "1M", "3M", "1Y", "Max"];

  return (
    <Container
      fluid
      className="nnmain py-4"
    >
      <div className=" mb-3 d-flex gap-3 flex-wrap justify-content-center justify-content-md-start">
        <div className="box ">
          <img src="assets/images/nncoin.png" className="img-fluid" style={{ height: 40 }} alt="" />
          <div>
            <h5 className="mb-1 nnhead" >NNC Price</h5>
            <h5 style={{ fontWeight: "700" }} className="mb-1 nnhead">{loading ? "Loading..." : chartInfo?.price}</h5>
          </div>
          <div>
            {/* <p>+0.256%</p> */}
           <p className="text-success"> {loading ? "Fetching..." : chartInfo?.percentageChange}</p>
          </div>
        </div>
        <div className="box ">
          <img src="assets/images/nncoin.png" className="img-fluid" style={{ height: 40 }} alt="" />
          <div>
            <h5 className="mb-1 nnhead" >NNC Price</h5>
            <h5 style={{ fontWeight: "700" }} className="mb-1 nnhead">{loading ? "Loading..." : chartInfo?.price}</h5>
          </div>
          <div>
            <p className="text-success">{loading ? "Fetching..." : chartInfo?.percentageChange}</p>
          </div>
        </div>
      </div>
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={10} lg={12}>
          <Card className="bg-black text-white shadow-lg border-0 rounded-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="fw-bold fs-4">NNC</Card.Title>

                {/* 🔘 Time Filter */}
                <ButtonGroup
                  className="bg-[#1a1a1a] rounded-pill overflow-hidden"
                  style={{ backgroundColor: "#1a1a1a" }}
                >
                  {ranges.map((range) => (
                    <Button
                      key={range}
                      variant="dark"
                      className={`border-0 px-3 py-1 ${selectedRange === range ? "text-white fw-bold" : "text-secondary"
                        }`}
                      style={{
                        backgroundColor:
                          selectedRange === range ? "#20242a" : "transparent",
                        fontSize: "0.9rem",
                        borderRadius: "0",
                      }}
                      onClick={() => setSelectedRange(range)}
                    >
                      {range}
                    </Button>
                  ))}
                </ButtonGroup>
              </div>

              {/* Chart */}
              <div style={{ height: "400px" }}>
                <Line ref={chartRef} data={data} options={options} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomChart;
