import { useState } from 'react';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';

function Header() {
   const [selected, setSelected] = useState("Select Chain");
  
    const handleSelect = (value) => {
      setSelected(value);
    };
  return (
    <>
      {[ 'xl'].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3 ">
          <Container fluid>
          <Navbar.Brand >
            Welcome SuperAdmin
            <div className='d-flex flex-co' style={{fontSize:14, wordBreak:"break-all"}}>
                WALLET ADDRESS : &nbsp; <br />
                <span style={{fontSize:14, textWrap:"auto"}}>0x742d35Cc6634C0532925a3b844Bc454e4438f44e</span>
            </div>
          </Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Offcanvas
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className='align-items-center'>
                  
                <Nav className="justify-content-center flex-grow-1 pe-3">
                  
                 {/* <img src="assets/images/logo/logo1.svg" alt="nnscan logo" className="w-25  mb-8" /> */}
                </Nav>
                <Dropdown as={ButtonGroup} className="mt-4">
            <Dropdown.Toggle
              variant="light"
              className="shadow-sm fw-semibold"
              style={{
                borderRadius: "10px",
                padding: "10px 18px",
                border: "1px solid #d0d7de",
                backgroundColor: "#fff",
              }}
            >
              {selected}
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow-sm">
              <Dropdown.Item onClick={() => handleSelect(" NN Scan Chain")}>
                NN Scan Chain
              </Dropdown.Item>
              {/* <Dropdown.Item onClick={() => handleSelect(" NN Scan Chain")}>
              NN Scan Chain
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelect(" NN Scan Chain")}>
             NN Scan Chain
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelect(" NN Scan Chain")}>
                NN Scan Chain
              </Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default Header;