import React, { useEffect, useState } from "react";
import Header from "../directives/Header";
import { Container, Form } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { GetAllvalidatorlist } from "../../uitils/action";
import { useNavigate } from "react-router-dom";

const ListingValidator = () => {
  const [validatorList, setValidatorList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();

  const fetchValidators = async (pageNo = 1, search = "", status = "All") => {
    try {
      let statusParam = "";
      if (status === "Active") {
        statusParam = "BOND_STATUS_BONDED";
      } else if (status === "Inactive") {
        statusParam = "BOND_STATUS_UNBONDED" || "BOND_STATUS_UNBONDING";
      }

      const params = {
        page: pageNo,
        limit,
        search,
        status: statusParam,
      };
      const res = await GetAllvalidatorlist(params);
      if (res?.success) {
        setValidatorList(res.data || []);
        setTotalRows(res.totalCount || 0);
      }
       else {
        console.error("Failed to fetch validators:", res?.message);
      }
    } catch (error) {
      console.error("Error fetching validators:", error);
    }
  };

  useEffect(() => {
    fetchValidators(page, searchText, statusFilter);
  }, [page, searchText, statusFilter]);

  const columns = [
    {
      name: "Moniker",
      selector: (row) => row.description?.moniker || "N/A",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <span
          style={{
            color: row.status === "BOND_STATUS_BONDED" ? "green" : "red",
            fontWeight: 600,
          }}
        >
          {row.status === "BOND_STATUS_BONDED" ? "Active" : "Inactive"}
        </span>
        
      ),
    },
    // {
    //   name: "Tokens",
    //   selector: (row) => (parseFloat(row.tokens) / 1e18).toFixed(2) + " NnCoin",
    //   sortable: true,
    // },
    {
  name: "Tokens",
  selector: (row) => row?.tokens || "0",
  sortable:true
},
    {
      name: "Commission Rate",
      selector: (row) =>
        (
          parseFloat(row.commission?.commission_rates?.rate || 0) * 100
        ).toFixed(2) + "%",
        sortable:true
    },
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <div
    //       onClick={() => navigate(`/validator-details/${row.operator_address}`)}
    //       style={{
    //         backgroundColor: "#42D74E7A",
    //         borderRadius: "5px",
    //         fontWeight: 700,
    //         width: "fit-content",
    //         cursor: "pointer",
    //       }}
    //       className="px-4 py-2"
    //     >
    //       View
    //     </div>
    //   ),
    // },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontSize: "18px",
        fontWeight: 700,
      },
    },
  };

  const searchFilter = (data) => { return data.filter(iteam => iteam.description?.moniker.toLowerCase().includes(searchText.toLowerCase())); }

  return (
    <>
      <Header />
      <Container fluid className="p-4">
        <section className="px-3">
          <h4 className="mb-4 nnhead fw-700">Validator Listing</h4>

          <div className="w-100 d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
            <Form.Control
              type="text"
              placeholder="Search by Moniker..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setPage(1);
              }}
              className="mb-3"
              style={{ width: "300px" }}
            />

            <Form.Select
              className="mb-3"
              style={{ width: "300px" }}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">All Validators</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Form.Select>

          </div>


          <div
            className="p-4"
            style={{ border: "1px solid black", borderRadius: 10 }}
          >
            <DataTable
              customStyles={customStyles}
              columns={columns}
              data={searchFilter(validatorList)}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangePage={(p) => setPage(p)}
              paginationPerPage={limit}
            />
          </div>
        </section>
      </Container>
    </>
  );
};

export default ListingValidator;
