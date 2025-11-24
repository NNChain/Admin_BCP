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
} from "../../uitils/action";

const NftDetail = () => {
  const { state } = useLocation();
  const nft = state?.nft;
  const [nftInfo, setNftInfo] = useState(null);
  const [mintLoading, setMintLoading] = useState(false);
  const [transferAddress, setTransferAddress] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showMintConfirm, setShowMintConfirm] = useState(false);
  const [transferCompleted, setTransferCompleted] = useState(false);

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

  const handleCloseTransfer = () => setShowTransferModal(false);
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
      const res = await MintNft(payload);

      const mintPayload = {
        token_id: nftInfo.nft_id,
        token_uri: nftInfo.token_uri || "",
      };
      const mintRes = await MintNftCurl(mintPayload);

      if (res?.success && mintRes?.success) {
        toast.success("NFT minted successfully!");
        await fetchNftDetails(nftInfo.nft_id);
      } else {
        toast.error(res?.message || mintRes?.message || "Minting failed");
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
      }

      // Update DB: set new owner + reset confirmations
      const updatePayload = {
        nft_id: nftInfo.nft_id,
        owner_address: transferAddress.trim(),

      };
      const updateRes = await MintNft(updatePayload);

      if (!updateRes?.success) {
        toast.error("Failed to update NFT ownership in DB");
        return;
      }

      setNftInfo(updateRes.data);
      setTransferCompleted(true);
      toast.success("NFT transferred successfully!");
      handleCloseTransfer();
    } catch (error) {
      console.error("Transfer error:", error);
      toast.error("Error during NFT transfer");
    } finally {
      setTransferLoading(false);
    }
  };

  if (!nftInfo)
    return <p className="text-center mt-5">Loading NFT details...</p>;

  const displayValue = (val) => (val ? val : "NA");

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Header />

      <Container fluid className="px-4 py-5" style={{ backgroundColor: "#f8f9fa" }}>
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

              <p className="fw-600 fs-18 mb-0" style={{ fontWeight: 700 }}>
                Description
              </p>
              <p className="text-muted mb-3" style={{ fontSize: "1.08rem" }}>
                {displayValue(nftInfo.description)}
              </p>

              <div className="mb-3" style={{ wordBreak: "break-all" }}>
                <strong className="text-dark">Tx Hash </strong> <br />
                {displayValue(nftInfo.transaction_hash)}
              </div>

              <div className="mb-3" style={{ wordBreak: "break-all" }}>
                <strong className="text-dark">Owner Address </strong> <br />
                {displayValue(nftInfo.owner_address)}
              </div>

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

              {/* ✅ Action Buttons */}
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
                ) : nftInfo.trx_confirmations === 0 ? (
                  <Button
                    variant="warning"
                    disabled
                    className="px-5 py-2 w-100 d-flex align-items-center justify-content-center"
                    style={{
                      borderRadius: 10,
                      fontWeight: "600",
                      fontSize: "1.1rem",
                    }}
                  >
                    Waiting for confirmation
                    <Spinner
                      animation="border"
                      size="sm"
                      role="status"
                      className="ms-2"
                    />
                  </Button>
                ) : transferCompleted  ? (
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
    // 🟢 Mint Button
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
  ) : nftInfo.trx_confirmations === 0 ? (
    // 🟡 Show Refresh Button instead of loader
    <Button
      variant="outline-warning"
      className="px-5 py-2 w-100 d-flex align-items-center justify-content-center"
      style={{
        borderRadius: 10,
        fontWeight: "600",
        fontSize: "1.1rem",
      }}
      onClick={() => fetchNftDetails(nftInfo.nft_id)}
    >
      🔁 Refresh Status
    </Button>
  ) : nftInfo.owner_address ? (
    // ✅ Active if owner exists
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
  ) : (
    // 🔵 Transfer Button
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
</div>

            </div>
          </Col>
        </Row>
      </Container>

      {/* Mint Confirmation Modal */}
      <Modal show={showMintConfirm} onHide={() => setShowMintConfirm(false)} centered>
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

      {/* Transfer Modal */}
      <Modal show={showTransferModal} centered onHide={handleCloseTransfer}>
        <Modal.Header closeButton>
          <Modal.Title>Transfer NFT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="transferAddress" label="New Owner Address">
            <Form.Control
              type="text"
              value={transferAddress}
              onChange={(e) => setTransferAddress(e.target.value)}
              placeholder="Enter recipient address"
              autoComplete="off"
            />
          </FloatingLabel>
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