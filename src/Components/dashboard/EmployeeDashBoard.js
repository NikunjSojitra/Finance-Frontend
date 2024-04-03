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
      .get("http://localhost:8000/allEmployeeData")
      .then((response) => {
        if (response.data) {

			console.log("data",id,response.data);
			const employData = response.data.find((e)=>e.user._id === id )

			console.log(employData,"emlooyee Data");
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
console.log(empData,"employee data in dashboard");


const createdAt = "2024-03-10T16:38:58.740Z"; // Your timestamp

const date = new Date(createdAt); // Convert timestamp to Date object
const formattedDate = date.toISOString().split('T')[0]; // Extract only the date part

console.log(formattedDate, "finaldate"); // Output: "2024-03-10"



  return (
    <>
      <div className="employe_dashboard">
        <div className="container">
          <Row className="my-5  text-center">
            <Col>
              <h3>- User's Dashboard - </h3>
            </Col>
          </Row>

          <div ref={tableRef}>
            <div className="employee_data my-5">
              <div className="d-flex">
                <div className="pr-3">
                  <h6>ID :</h6>
                  <h5>Name :</h5>
                  <h5>Email :</h5>
                  <h5>Mobile :</h5>
                  {/* <h5>House No. </h5> */}
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

            <Table striped bordered hover>
              <thead>
                <tr>
                  {/* <th>Id</th>
								<th>First Name</th>
								<th>Last Name</th>
								<th>Email</th>
								<th>Mobile</th> */}
                  <th>Date</th>
                  <th>Credit Amount</th>
                  <th>Debit Amount</th>
                  <th>Interest Amount</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {empData?.user
                  ? empData?.latestTransaction?.map((latestTransaction, index) => {
                      return (
                        <>
                          <tr key={transactions.id}>
                            <td>{latestTransaction?.createdAt}</td>
                            <td>{latestTransaction?.credit || 0}</td>
                            <td>{latestTransaction?.debit || 0}</td>
                            <td>{latestTransaction?.interest || 0}</td>
                            <td>{latestTransaction?.totalAmount || 0}</td>
                          </tr>
                        </>
                      );
                    })
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
