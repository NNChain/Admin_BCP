import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Spinner, Alert, Table, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";

const ValidatorDetails = () => {
  const { address } = useParams();
  const [validatorData, setValidatorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matched, setMatched] = useState(false);

  const contractAddress ="nnc14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9scu7ase";

  useEffect(() => {
    const fetchValidatorDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const query = { nft_info: { token_id: "V1" } };
        const encodedQuery = btoa(JSON.stringify(query));
        const proxyUrl = `${API_URL}/proxy/${contractAddress}/${encodedQuery}`;

        const res = await axios.get(proxyUrl);
        console.log(res,"res")
        const nftInfo = res.data;
        if (!nftInfo?.data.token_uri) throw new Error("Invalid NFT info");

        const metadataUrl = nftInfo.data.token_uri;
        console.log("Fetching metadata from:", metadataUrl);

        const metaRes = await axios.get(metadataUrl);
        console.log("Metadata safsdf: ", metaRes.data);

        setValidatorData(metaRes.data);

        // Step 3: Match validator address
        const validatorAttr = metaRes.data.attributes.find(
          (attr) => attr.trait_type === "Validator Address"
        );

        if (
          validatorAttr &&
          validatorAttr.value.toLowerCase() === address?.toLowerCase()
        ) {
          setMatched(true);
        } else {
          setMatched(false);
        }
      } catch (err) {
        console.error("Error fetching validator data:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchValidatorDetails();
  }, [address]);

  console.log({ validatorData, matched, address });

  return (
    <Container className="p-4">
      <h3 className="fw-bold mb-4 text-center">Validator Details</h3>

      {loading && (
        <div className="text-center mt-5">
          <Spinner animation="border" />
          <p className="mt-2">Loading validator details...</p>
        </div>
      )}

      {error && <Alert variant="danger">Error: {error}</Alert>}

      {!loading && validatorData && (
        <Card className="shadow-sm p-4">
          <div className="text-center mb-3">
            {validatorData.image && (
              <img
                src={validatorData.image}
                alt={validatorData.name}
                style={{
                  maxWidth: "250px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                }}
              />
            )}
          </div>

          <h4 className="text-center fw-bold">{validatorData.name}</h4>
          <p className="text-muted text-center">{validatorData.description}</p>

          <Table bordered hover responsive className="mt-3">
            <tbody>
              {validatorData.attributes.map((attr, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, width: "250px" }}>
                    {attr.trait_type}
                  </td>
                  <td>{attr.value}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="text-center mt-3">
            {matched ? (
              <Alert variant="success">✅ Address matched!</Alert>
            ) : (
              <Alert variant="warning">
                {/* ⚠️ Address does not match this validator NFT. */}
              </Alert>
            )}
          </div>
        </Card>
      )}
    </Container>
  );
};

export default ValidatorDetails;
