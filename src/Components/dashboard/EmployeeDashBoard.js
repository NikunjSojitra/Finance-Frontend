import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";

const EmployeeDashboard = () => {
  const { id } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [empData, setEmpData] = useState({});
  const location = useLocation();
  const data = location.state?.empRes;

  useEffect(() => {
    axios
      .get("https://finance-backend-jvuy.onrender.com/allEmployeeData")
      .then((response) => {
        if (response.data) {
          console.log("data", id, response.data);
          const employData = response.data.find((e) => e.user._id === id);

          console.log(employData, "emlooyee Data");
          setEmpData(employData);
        } else {
          console.warn(response);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const tableRef = useRef();
  const exportToPDF = () => {
    const input = tableRef.current;
    html2canvas(input).then((canvas) => {
      const pdf = new jsPDF("p", "pt", "a4");
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth(100);
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("table.pdf");
    });
  };
  console.log(empData, "employee data in dashboard");

  const createdAt = "2024-03-10T16:38:58.740Z"; // Your timestamp

  const date = new Date(createdAt); // Convert timestamp to Date object
  const formattedDate = date.toISOString().split("T")[0]; // Extract only the date part

  console.log(formattedDate, "finaldate"); // Output: "2024-03-10"

  return (
    <>
      {/* modal */}

      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Daily Amount
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">...</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* modal */}

      <div className="employe_dashboard">
        <div className="container">
          <Row className="my-5  text-center">
            <Col>
              <h3>- User's Dashboard - </h3>
            </Col>
          </Row>

          <div ref={tableRef}>
            <div className="employee_data my-5">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12">
                  <div className="d-flex">
                    <div className="pr-3">
                      <h6>ID :</h6>
                      <h5>Name :</h5>
                      <h5>Email :</h5>
                      <h5>Mobile :</h5>
                    </div>
                    <div className="px-3">
                      <h6>{empData ? empData?.user?._id : ""}</h6>
                      <h5>
                        {empData?.user
                          ? `${empData?.user?.fname} ${empData?.user?.lname}`
                          : ""}
                      </h5>
                      <h5>{empData?.user ? empData?.user?.email : ""}</h5>
                      <h5>{empData?.user ? empData?.user?.mobile : ""}</h5>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12">
                  <div className="d-flex">
                    <div className="pr-3">
                      <h6>Amount :</h6>
                      <h5>Interest :</h5>
                      <h5>Payment :</h5>
                      <h5>Remainig Amount :</h5>
                    </div>
                    <div className="px-3">
                      <h6>{empData ? empData?.user?._id : ""}</h6>
                      <h5>
                        {empData?.user
                          ? `${empData?.user?.fname} ${empData?.user?.lname}`
                          : ""}
                      </h5>
                      <h5>{empData?.user ? empData?.user?.email : ""}</h5>
                      <h5>{empData?.user ? empData?.user?.mobile : ""}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button data-bs-toggle="modal" data-bs-target="#exampleModal" className="mb-3">
             + Add Daily Payment
            </button>

            <Table striped bordered hover>
              <thead>
                <tr>
                  {/* <th>Id</th>
								<th>First Name</th>
								<th>Last Name</th>
								<th>Email</th>
								<th>Mobile</th> */}
                  <th>Date</th>
                  <th>Daily Amount</th>
                  {/* <th>Debit Amount</th>
                  <th>Total Amount</th> */}
                  <th>Remaining Amount</th>
                </tr>
              </thead>
              <tbody>
                {empData?.user
                  ? empData?.latestTransaction?.map(
                      (latestTransaction, index) => {
                        return (
                          <>
                            <tr key={transactions.id}>
                              <td>{latestTransaction?.createdAt}</td>
                              <td>{latestTransaction?.credit || 0}</td>
                              <td>{latestTransaction?.debit || 0}</td>
                              {/* <td>{latestTransaction?.interest || 0}</td>
                              <td>{latestTransaction?.totalAmount || 0}</td> */}
                            </tr>
                          </>
                        );
                      }
                    )
                  : ""}
                {/* {transactions.map((transaction) => ( */}
              </tbody>
            </Table>
          </div>
          <Button className="d-flex justify-content-end" onClick={exportToPDF}>
            Download PDF
          </Button>
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;
