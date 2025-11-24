import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Header from '../directives/Header';
import { GetgenisesData } from '../../uitils/action';
import toast from 'react-hot-toast';

const ChainData = () => {
  const [genesisData, setGenesisData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenesis = async () => {
      setLoading(true);
      try {
        const res = await GetgenisesData(); // should return data.result.genesis
        if (res) {
          setGenesisData(res);
        } else {
          toast.error("No genesis data found");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching genesis data");
      }
      setLoading(false);
    };

    fetchGenesis();
  }, []);

  const renderObject = (obj) => {
    if (!obj) return null;

    return (
      <ul>
        {Object.entries(obj).map(([key, value]) => (
          <li key={key}>
            <strong>{key}: </strong>
            {typeof value === 'object' && value !== null ? renderObject(value) : String(value)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <Header />
      <Container fluid className="p-4">
        <section className="px-3">
          <h4 className="mb-4 nnhead fw-700">Genesis Data</h4>
          {loading ? <p>Loading genesis data...</p> : renderObject(genesisData)}
        </section>
      </Container>
    </>
  );
};

export default ChainData;
