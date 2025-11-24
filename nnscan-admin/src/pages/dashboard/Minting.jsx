import React, { useEffect, useState } from "react";
import Header from "../directives/Header";
import { FaSearch } from "react-icons/fa";
import {
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Pagination,
  Row,
  ButtonGroup,
  Dropdown as BootstrapDropdown,
} from "react-bootstrap";
import { GetNftList } from "../../uitils/action";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Minting = () => {
  const [NftList, setNftList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await GetNftList();
        if (res.success) {
          setNftList(res.data);
        } else {
          toast.error("Failed to fetch NFT list");
        }
      } catch (error) {
        console.error("Failed to load NFTs:", error);
        toast.error("Failed to load NFTs");
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    let filtered = [...NftList];

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(lowerSearch) ||
          item.nft_id?.toString().toLowerCase().includes(lowerSearch) ||
          item.type?.toLowerCase().includes(lowerSearch) ||
          item.validator_moniker?.toLowerCase().includes(lowerSearch) ||
          item.owner_address?.toLowerCase().includes(lowerSearch)
      );
    }

    if (selectedType !== "All") {
      if (selectedType === "Active") {
        // Show items that are minted and have an owner address
        filtered = filtered.filter(
          (item) => item.is_minted === true && item.owner_address
        );
      } else if (selectedType === "Minted") {
        // Show only minted items
        filtered = filtered.filter((item) => item.is_minted === true);
      } else if (selectedType === "Inactive") {
        // Show items that are NOT minted or have no owner address
        filtered = filtered.filter(
          (item) => item.is_minted === false || !item.owner_address
        );
      } else {
        // Generic name or validator_moniker match
        filtered = filtered.filter((item) => {
          const searchTerm = selectedType
            .toLowerCase()
            .replace("type ", "validator ");
          const nameMatch = item.name?.toLowerCase().includes(searchTerm);
          const monikerMatch = item.validator_moniker
            ?.toLowerCase()
            .includes(searchTerm);
          return nameMatch || monikerMatch;
        });
      }
    }


    setFilteredList(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedType, NftList]);

  // 🔢 Pagination logic
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const shortenHash = (hash) =>
    hash ? `${hash.slice(0, 6)}...${hash.slice(-6)}` : "N/A";

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetch delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);


  return (
    <>
      <Header />
      <Toaster position="top-right" reverseOrder={false} />

      <Container fluid className="p-4">
        {/* 🔍 Search + Dropdown Filter */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <Form className="w-100" style={{ maxWidth: "500px" }}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search by Validator Type, NFT ID or Name"
                style={{
                  borderRadius: "30px 0 0 30px",
                  padding: "12px 18px",
                  border: "1px solid #d0d7de",
                }}
                className="shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="button"
                style={{
                  borderRadius: "0 30px 30px 0",
                  padding: "0 20px",
                  border: "none",
                  backgroundColor: "#c79d4c",
                  color: "#fff",
                }}
              >
                <FaSearch />
              </button>
            </InputGroup>
          </Form>

          <BootstrapDropdown as={ButtonGroup} className="">
            <BootstrapDropdown.Toggle
              variant="light"
              className="shadow-sm fw-semibold"
              style={{
                borderRadius: "25px",
                padding: "10px 18px",
                border: "1px solid #d0d7de",
                backgroundColor: "#fff",
              }}
            >
              {selectedType === "All" ? "Sort By" : selectedType}
            </BootstrapDropdown.Toggle>

            <BootstrapDropdown.Menu className="shadow-sm">
              <BootstrapDropdown.Item onClick={() => setSelectedType("All")}>
                All Types
              </BootstrapDropdown.Item>
              <BootstrapDropdown.Item onClick={() => setSelectedType("Type Z")}>
                Type Z
              </BootstrapDropdown.Item>
              <BootstrapDropdown.Item onClick={() => setSelectedType("Type I")}>
                Type I
              </BootstrapDropdown.Item>
              <BootstrapDropdown.Item onClick={() => setSelectedType("Type II")}>
                Type II
              </BootstrapDropdown.Item>
              <BootstrapDropdown.Item onClick={() => setSelectedType("Type III")}>
                Type III
              </BootstrapDropdown.Item>
              <BootstrapDropdown.Item onClick={() => setSelectedType("Active")}>
                Type Active
              </BootstrapDropdown.Item>
              <BootstrapDropdown.Item onClick={() => setSelectedType("Minted")}>
                Type Minted
              </BootstrapDropdown.Item>
              <BootstrapDropdown.Item onClick={() => setSelectedType("Inactive")}>
                Type Inactive
              </BootstrapDropdown.Item>
            </BootstrapDropdown.Menu>

          </BootstrapDropdown>
        </div>

        <br />

        {/* 🖼 NFT Cards */}

        {loading ? (
          // 🔹 Show shimmer placeholders
          Array.from({ length: 4 }).map((_, index) => (
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
          ))
        ) :
          currentItems.length > 0 ?
            <Row className="align-items-stretch">
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => {
                  return (
                    <Col key={index} xl={3} lg={4} md={6} sm={6} className="mb-4  h-100">
                      <Card>
                        <Link
                          to={`/minting/${item._id}`}
                          state={{ nft: item }}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <Card.Header className="d-flex justify-content-center card-color">
                            <img
                              className="img-fluid"
                              style={{
                                maxHeight: 250,
                                objectFit: "cover",
                                objectPosition: "top center",
                              }}
                              src={item.image}
                              alt={item.name}
                            />
                          </Card.Header>

                          <Card.Body>
                            <h4 className="fw-700 text-center">
                              #{item.nft_id} - {item.name}
                            </h4>
                            <p
                              className="mt-2 mb-0 text-center"
                              style={{ fontWeight: 400, fontSize: 14, minHeight: 30 }}
                            >
                              {item.description}
                            </p>
                            {/* {item.validator_moniker &&
                          item.validator_moniker !== "No owner address" &&
                          item.validator_moniker !== "Not Found" &&
                          item.validator_moniker !== "Error fetching data" && (
                            <p
                              className="mt-2 mb-0 text-center"
                              style={{ fontWeight: 400, fontSize: 14 }}
                            >
                              Validator: {item.validator_moniker}
                            </p>
                          )} */}
                          </Card.Body>
                        </Link>

                        <Card.Footer className="py-2 text-center">
                          {item.owner_address && item.is_minted ? (
                            <div className="py-1">

                              {/* <div className="d-flex justify-content-between ">
                                <p className="mb-0" style={{ fontWeight: 600, fontSize: 14 }}>Validator</p>
                                <p
                                  className=" mb-0 text-end"
                                  style={{ fontWeight: 400, fontSize: 14 }}
                                >
                                  {item.validator_moniker}
                                </p>
                              </div>
                              <div className="d-flex justify-content-between mt-2">
                                <p className="mb-0" style={{ fontWeight: 600, fontSize: 14 }}>Validator Address</p>
                                <p
                                  className=" mb-0 text-end"
                                  style={{ fontWeight: 400, fontSize: 14 }}
                                >
                                  {shortenHash(item.owner_address)}
                                </p>
                              </div> */}
                              {/* <span style={{ color: "green", fontWeight: "bold" }}>
                          Minted ✅
                        </span> */}
                            </div>
                          ) : (
                            <div style={{ color: "gray", fontWeight: "bold" }} className="py-3">
                              Not Active
                            </div>
                          )}
                        </Card.Footer>
                      </Card>
                    </Col>
                  )
                }
                )
              ) : (
                <div className="text-center mt-5">
                  <h5>No NFTs found</h5>
                </div>
              )}
            </Row>
            : <span className="loading"></span>
        }
        {totalPages > 1 && (
          <>

            <Pagination className="justify-content-center mt-3 cst-pagination">
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                  key={i}
                  active={currentPage === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </Pagination>
          </>
        )}
      </Container>
    </>
  );
};

export default Minting;
