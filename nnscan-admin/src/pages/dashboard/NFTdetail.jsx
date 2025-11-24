import toast, { Toaster } from "react-hot-toast";
import {
  Col,
  Container,
  Row,
  Badge,
  Modal,
  FloatingLabel,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Header from "../directives/Header";
import { useEffect, useState } from "react";
import {
  TransferNftCurl,
  MintNftCurl,
  MintNft,
  GetNftInfofromdatabase,
  changestatusofTRX,
  GetNftMetainfofromdatabase,
} from "../../uitils/action";
import {
  CheckCircleFill,
  ClockHistory,
  XCircleFill,
} from "react-bootstrap-icons";

const NftDetail = () => {
  const { state } = useLocation();
  const nft = state?.nft;
  const [nftInfo, setNftInfo] = useState(null);
  const [mintLoading, setMintLoading] = useState(false);
  const [transferAddress, setTransferAddress] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showMintConfirm, setShowMintConfirm] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [metaData, setMetaData] = useState(null);

  useEffect(() => {
    if (nft?.nft_id) {
      fetchNftDetails(nft.nft_id);
    } else {
      toast.error("NFT data not found!");
    }
  }, [nft]);

  const fetchNftDetails = async (nftId) => {
    try {
      const res = await GetNftInfofromdatabase(nftId);
      const nftMeatdata = await GetNftMetainfofromdatabase(nftId)
      // console.log(nftMeatdata,"nftMeatdata")
      setMetaData(nftMeatdata)
      if (res?.success && res.data) {
        setNftInfo(res.data);
      } else {
        toast.error("Failed to fetch NFT details");
      }
    } catch (error) {
      console.error("Error fetching NFT info:", error);
      toast.error("Error loading NFT info");
    }
  };

  const handleCloseTransfer = () => {
    setShowTransferModal(false), setTransferAddress("");
  };
  const handleShowTransfer = () => setShowTransferModal(true);

  const handleMintConfirm = async () => {
    setShowMintConfirm(false);
    try {
      if (!nftInfo?.nft_id) {
        toast.error("NFT ID missing");
        return;
      }

      setMintLoading(true);

      const payload = {
        nft_id: nftInfo.nft_id,
        is_minted: true,
        owner_address: nftInfo.owner_address || "",
      };

      const mintPayload = {
        token_id: nftInfo.nft_id,
        token_uri: nftInfo.token_uri || "",
      };
      const mintRes = await MintNftCurl(mintPayload);

      if (mintRes?.success) {
        toast.success(mintRes?.message || "NFT minted successfully!");

        // 🔹 After mint success, refresh NFT details automatically
        await fetchNftDetails(nftInfo.nft_id);
      } else {
        toast.error(mintRes?.message || "Minting failed");
      }
    } catch (error) {
      console.error("Mint error:", error);
      toast.error("Error during minting");
    } finally {
      setMintLoading(false);
    }
  };

  const handleTransferConfirm = async () => {
    try {
      if (!nftInfo?.nft_id) {
        toast.error("No NFT selected for transfer");
        return;
      }

      if (!transferAddress.trim()) {
        toast.error("Please enter transfer address");
        return;
      }
      setTransferLoading(true);
      const transferPayload = {
        token_id: nftInfo.nft_id,
        new_owner: transferAddress.trim(),
      };
      const transferRes = await TransferNftCurl(transferPayload);

      if (!transferRes?.success) {
        toast.error(transferRes?.message || "NFT transfer failed");
        return;
      } else {
        setTransferAddress("");
        toast.success(
          transferRes?.message || "NFT transfer initiated successfully!"
        );
      }

      // const updatePayload = {
      //   nft_id: nftInfo.nft_id,
      //   owner_address: transferAddress.trim(),
      // };
      // const updateRes = await MintNft(updatePayload);

      // if (!updateRes?.success) {
      //   toast.error("Failed to update NFT ownership in DB");
      //   return;
      // }

      // setNftInfo(updateRes.data);
      toast.success(transferRes?.message || "NFT transferred successfully!");
      handleCloseTransfer();
      setTransferAddress("");
      fetchNftDetails(nft.nft_id);
    } catch (error) {
      console.error("Transfer error:", error.response);
      toast.error(
        error?.response?.data?.message || error.message || "An error occurred!"
      );
    } finally {
      setTransferLoading(false);
    }
  };

  console.log(nft, "nft");

  if (!nftInfo)
    return <p className="text-center mt-5">Loading NFT details...</p>;

  // 🧠 Helper to show "NA" instead of null/undefined/empty
  const displayValue = (val) => (val ? val : "NA");
  console.log(metaData, "metaData")
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Header />

      <Container
        fluid
        className="px-4 py-5"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <Row className="g-5 d-flex justify-content-center">
          <Col lg={4} md={10} sm={12} className="px-0">
            <img
              className="img-fluid"
              style={{
                maxHeight: 400,
                objectFit: "contain",
                objectPosition: "center",
              }}
              src={displayValue(nftInfo.image)}
              alt="NFT"
            />
          </Col>

          <Col lg={6} md={10} sm={12}>
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="d-flex justify-content-between align-items-center">
                <h1 className="fw-bold mb-3">
                  #{nftInfo.nft_id} - {displayValue(nftInfo.name)}
                </h1>
                <Badge
                  bg={nftInfo.is_minted ? "success" : "secondary"}
                  className="px-3 py-2 fs-6 mb-3"
                >
                  {nftInfo.is_minted ? "Minted" : "Not Minted"}
                </Badge>
              </div>

              <div>
                <p className="fw-600 fs-18 mb-0" style={{ fontWeight: 700 }}>
                  Description
                </p>
                <p className="text-muted mb-3" style={{ fontSize: "1.08rem" }}>
                  {displayValue(nftInfo.description)}
                </p>
              </div>
              {/* <div>
                {nft?.validator_moniker &&
                  nft.validator_moniker !== "No owner address" &&
                  nft.validator_moniker !== "Not Found" && (
                    <div>
                      <p className="fw-600 fs-18 mb-0" style={{ fontWeight: 700 }}>
                        Validator Name
                      </p>
                      {nft.validator_moniker === "No owner address" || nft.validator_moniker === "Not Found"  ? <p
                        className="text-muted mb-3"
                        style={{ fontSize: "1.08rem" }}
                      >
                        NA
                      </p> : <p
                        className="text-muted mb-3"
                        style={{ fontSize: "1.08rem" }}
                      >
                        {displayValue(nft.validator_moniker)}
                      </p>} 
                     
                    </div>
                  )}
              </div> */}

              <div
                className="mb-3 d-flex align-items-center"
                style={{ wordBreak: "break-all" }}
              >
                <div className="flex-grow-1">
                  <strong className="text-dark">NFT Transfer Hash </strong> <br />
                  {displayValue(nftInfo.transaction_hash)}
                </div>
                <div className="ms-2">
                  {nftInfo.trx_confirmations === 1 ? (
                    <ClockHistory
                      color="orange"
                      size={22}
                      title="Pending Confirmation"
                    />
                  ) : nftInfo.trx_confirmations === 2 ? (
                    <CheckCircleFill
                      color="green"
                      size={22}
                      title="Confirmed"
                    />
                  ) : nftInfo.trx_confirmations === 3 ? (
                    <XCircleFill color="red" size={22} title="Failed" />
                  ) : null}
                </div>
              </div>
              {/* {nftInfo?.minted_hash && (
                <div className="mb-3" style={{ wordBreak: "break-all" }}>
                  <strong className="text-dark">NFT Mint Hash </strong> <br />
                  {displayValue(nftInfo.minted_hash)}
                </div>
              )} */}
              {/* <div className="mb-3" style={{ wordBreak: "break-all" }}>
                <strong className="text-dark">Minter Address </strong> <br />
                {displayValue(nftInfo.minter_address)}
              </div> */}
              {/* <div className="mb-3" style={{ wordBreak: "break-all" }}>
                <strong className="text-dark">Owner Address </strong> <br />
                {nftInfo.owner_address && nftInfo.trx_confirmations == 2 ?
                  displayValue(nftInfo.owner_address) : 'NA'
                }
              </div> */}
              {metaData?.attributes?.length > 0 &&
                metaData.attributes.map((attr, index) => (
                  <div key={index} className="mb-3" style={{ wordBreak: "break-all" }}>
                    <strong className="text-dark">{attr.trait_type}</strong> <br />
                    {attr.value ? attr.value : "NA"}
                  </div>
                ))
              }
              <Row>
                <Col>
                  <div className="mb-2">
                    <strong className="text-dark">Created: </strong> <br />
                    {nftInfo.createdAt
                      ? new Date(nftInfo.createdAt).toLocaleString()
                      : "NA"}
                  </div>
                </Col>
                <Col>
                  <div>
                    <strong className="text-dark">Updated: </strong> <br />
                    {nftInfo.updatedAt
                      ? new Date(nftInfo.updatedAt).toLocaleString()
                      : "NA"}
                  </div>
                </Col>
              </Row>

              {/* <div className="mt-4">
                {!nftInfo.is_minted ? (
                  <Button
                    variant="success"
                    className="px-5 py-2 w-100"
                    style={{
                      borderRadius: 10,
                      fontWeight: "600",
                      fontSize: "1.1rem",
                    }}
                    onClick={() => setShowMintConfirm(true)}
                    disabled={mintLoading}
                  >
                    {mintLoading ? "Minting..." : "Mint NFT"}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="px-5 py-2 w-100"
                    style={{
                      borderRadius: 10,
                      fontWeight: "600",
                      fontSize: "1.1rem",
                    }}
                    onClick={handleShowTransfer}
                  >
                    Transfer NFT
                  </Button>
                )}
              </div> */}

              <div className="mt-4">
                {!nftInfo.is_minted ? (
                  <Button
                    variant="success"
                    className="px-5 py-2 w-100"
                    style={{
                      borderRadius: 10,
                      fontWeight: "600",
                      fontSize: "1.1rem",
                    }}
                    onClick={() => setShowMintConfirm(true)}
                    disabled={mintLoading}
                  >
                    {mintLoading ? "Minting..." : "Mint NFT"}
                  </Button>
                ) : nftInfo.trx_confirmations === 1 ? (
                  <Button
                    variant="warning"
                    className="px-5 py-2 w-100 d-flex align-items-center justify-content-center"
                    style={{
                      borderRadius: 10,
                      fontWeight: "600",
                      fontSize: "1.1rem",
                    }}
                    onClick={async () => {
                      try {
                        setRefreshLoading(true); // start loader

                        // ✅ Call backend API to check transaction status
                        const response = await changestatusofTRX(
                          nftInfo.transaction_hash
                        );
                        console.log(response, "response");

                        fetchNftDetails(nft.nft_id);
                        if (response?.success) {
                          toast.success(
                            response.message ||
                            "Transaction checked successfully"
                          );
                        } else {
                          toast.error(
                            response?.message || "Transaction not confirmed yet"
                          );
                        }
                      } catch (error) {
                        console.error("Error checking transaction:", error);
                        toast.error(
                          "Something went wrong while checking transaction, Please wait a moment and try again."
                        );
                      } finally {
                        setRefreshLoading(false); // stop loader
                      }
                    }}
                    disabled={refreshLoading}
                  >
                    {refreshLoading ? (
                      <>
                        Refreshing...
                        <Spinner
                          animation="border"
                          size="sm"
                          role="status"
                          className="ms-2"
                        />
                      </>
                    ) : (
                      "Click to Update Transaction Status"
                    )}
                  </Button>
                ) : (nftInfo.trx_confirmations != 2 ||
                  nftInfo.owner_address == "null" ||
                  !nftInfo.owner_address) &&
                  (!nftInfo.owner_address ||
                    nftInfo.owner_address == "null") ? (
                  <Button
                    // variant="primary"
                    className="px-5 py-2 w-100 custom-color"
                    style={{
                      borderRadius: 10,
                      fontWeight: "600",
                      fontSize: "1.1rem",
                      border: "none",
                    }}
                    onClick={handleShowTransfer}
                  >
                    Transfer NFT
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    disabled
                    className="px-5 py-2 w-100"
                    style={{
                      borderRadius: 10,
                      fontWeight: "600",
                      fontSize: "1.1rem",
                    }}
                  >
                    ✅ Active
                  </Button>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      {/* ==================== VALIDATOR DETAILS SECTION ==================== */}
      {/* {nft && (
        <Container
          fluid
          className="px-5 py-5 mt-4"
          style={{ backgroundColor: "#ffffff" }}
        >
          {(nft.validator_moniker &&
            nft.validator_moniker !== "No owner address" &&
            nft.validator_moniker !== "Not Found") ||
            nft.validator_status ||
            nft.validator_tokens ||
            nft.validator_commission ||
            nft.validator_jailed !== undefined ? (
            <div className="bg-light p-5 rounded shadow-lg">
              <h2 className="fw-bold mb-5 text-center ">
                Validator Details
              </h2>

              <Row className="g-4">
                {nft?.validator_moniker &&
                  nft.validator_moniker !== "No owner address" &&
                  nft.validator_moniker !== "Not Found" && (
                    <Col md={6} lg={4}>
                      <div>
                        <strong className="text-dark fs-5">Validator Name</strong>
                        <p className="text-muted fs-6 mb-0">
                          {displayValue(nft.validator_moniker)}
                        </p>
                      </div>
                    </Col>
                  )}

                <div className="mb-3 d-flex align-items-center" style={{ wordBreak: "break-all" }}>
                  <div className="flex-grow-1">
                    <strong className="text-dark">Tx Hash </strong> <br />
                    {displayValue(nftInfo.transaction_hash)}
                  </div>
                  <div className="ms-2">
                    {nftInfo.trx_confirmations === 1 ? (
                      <ClockHistory color="orange" size={22} title="Pending Confirmation" />
                    ) : nftInfo.trx_confirmations === 2 ? (
                      <CheckCircleFill color="green" size={22} title="Confirmed" />
                    ) : nftInfo.trx_confirmations === 3 ? (
                      <XCircleFill color="red" size={22} title="Failed" />
                    ) : null}
                  </div>
                </div>
                {nftInfo?.minted_hash && (
                  <div className="mb-3" style={{ wordBreak: "break-all" }}>
                    <strong className="text-dark">Minted Hash </strong> <br />
                    {displayValue(nftInfo.minted_hash)}
                  </div>
                )}
                <div className="mb-3" style={{ wordBreak: "break-all" }}>
                  <strong className="text-dark">Minter Address</strong> <br />
                  {nftInfo?.minter_address && nftInfo.minter_address.trim() !== ""
                    ? displayValue(nftInfo.minter_address)
                    : "NA"}
                </div>

                <div className="mb-3" style={{ wordBreak: "break-all" }}>
                  <strong className="text-dark">Validator Address </strong> <br />
                  {nftInfo.owner_address && nftInfo.trx_confirmations == 2 ?
                    displayValue(nftInfo.owner_address) : 'NA'
                  }
                </div>


                {(nftInfo?.validator_status || nft.validator_status) && (
                  <Col md={6} lg={4}>
                    <div>
                      <strong className="text-dark fs-5">Status</strong>
                      <p className="text-muted fs-6 mb-0">
                        {displayValue(nftInfo?.validator_status || nft.validator_status)}
                      </p>
                    </div>
                  </Col>
                )}

                {(nftInfo?.validator_tokens || nft.validator_tokens) && (
                  <Col md={6} lg={4}>
                    <div>
                      <strong className="text-dark fs-5">Total Tokens</strong>
                      <p className="text-muted fs-6 mb-0">
                        {displayValue(nftInfo?.validator_tokens || nft.validator_tokens)}
                      </p>
                    </div>
                  </Col>
                )}

                {(nftInfo?.validator_commission || nft.validator_commission) && (
                  <Col md={6} lg={4}>
                    <div>
                      <strong className="text-dark fs-5">Commission Rate</strong>
                      <p className="text-muted fs-6 mb-0">
                        {(
                          parseFloat(
                            nftInfo?.validator_commission || nft.validator_commission
                          ) * 100
                        ).toFixed(2)}
                        %
                      </p>
                    </div>
                  </Col>
                )}

                {(nftInfo?.validator_jailed !== undefined ||
                  nft.validator_jailed !== undefined) && (
                    <Col md={6} lg={4}>
                      <div>
                        <strong className="text-dark fs-5">Jailed</strong>
                        <p
                          className={`fs-6 mb-0 fw-bold ${nftInfo?.validator_jailed || nft.validator_jailed
                            ? "text-danger"
                            : "text-success"
                            }`}
                        >
                          {nftInfo?.validator_jailed || nft.validator_jailed
                            ? "Yes"
                            : "No"}
                        </p>
                      </div>
                    </Col>
                  )}
              </Row>
            </div>
          ) : null}
        </Container>
      )} */}



      {/* ✅ Mint Confirmation Modal */}
      <Modal
        show={showMintConfirm}
        onHide={() => setShowMintConfirm(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Mint</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to mint this NFT?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMintConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleMintConfirm}
            disabled={mintLoading}
          >
            {mintLoading ? "Minting..." : "Yes, Mint Now"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Transfer Modal */}
      <Modal show={showTransferModal} centered onHide={handleCloseTransfer}>
        <Modal.Header closeButton>
          <Modal.Title>Transfer NFT</Modal.Title>
          <p> </p>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <Form.Label className="fw-semibold">
              Please enter the new validator address to transfer NFT
            </Form.Label>

            <FloatingLabel
              controlId="transferAddress"
              label="Enter new validator address"
            >
              <Form.Control
                type="text"
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
                placeholder="Enter recipient address"
                autoComplete="off"
              />
            </FloatingLabel>

            <Form.Text className="text-muted">
              {/* Ensure the address belongs to a registered validator before confirming the transfer. */}
            </Form.Text>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleTransferConfirm}
            disabled={transferLoading}
            className="w-100"
          >
            {transferLoading ? "Transferring..." : "Confirm Transfer"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NftDetail;