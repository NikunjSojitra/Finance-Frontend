/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { useParams } from "react-router-dom";
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable'
import "jspdf-autotable";
import {
  ClientSideRowModelModule,
  DateFilterModule,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  AllCommunityModule,
} from "ag-grid-community";
import ManagerDashboard from "./ManagerDashboard";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClientSideRowModelModule,
  NumberFilterModule,
  DateFilterModule,
  TextFilterModule,
  ValidationModule,
]);


const EmployeeDashboard = () => {

  const { id } = useParams();
  const [payment, setPayment] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [empData, setEmpData] = useState([]);
  const [role, setRole] = useState("");
  const [colDefs, setColDefs] = useState([
    { headerName: 'Sr. No.', valueGetter: 'node.rowIndex + 1', width: 100 },
    {
      headerName: "Date", field: "createdAt", valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : ""
    },
    { headerName: "Daily Amount	", field: "credit" },
    { headerName: "Remaining Amount	", field: "totalAmount" },
  ])
  const gridRef = useRef(null);

  const fetchEmpData = async () => {
    try {
      const response = await axios.get("https://finance-backend-jvuy.onrender.com/allEmployeeData");
      const userData = response.data.find((e) => e.user._id === id);
      const role = Storage.getItem("role");
      setRole(role);
      console.log('userData :>> ', role);
      if (userData && userData.latestTransaction) {
        setEmpData(userData);
        setRowData(userData.latestTransaction); // Ensure data is set
      } else {
        console.warn("No transactions found for this user.");
        setRowData([]); // Set empty data if transactions are missing
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };


  const paymentSubmit = async (e) => {
    e.preventDefault();
    const parsedPayment = parseFloat(payment);

    // Get the last remaining amount from the data
    const totalPendingAmount = empData.userAmount.totalAmount;
    const lastAddedAmount = empData.latestTransaction[0]?.totalAmount;
    let finalAmount;
    console.log('lastAddedAmount :>> ', lastAddedAmount);

    if (!isNaN(parsedPayment) && parsedPayment > 0) {
      if (lastAddedAmount) {
        finalAmount = lastAddedAmount - parsedPayment;
      } else {
        finalAmount = totalPendingAmount - parsedPayment;
      }

      try {
        const response = await axios.post("https://finance-backend-jvuy.onrender.com/updateEmpData/cash", {
          userId: id,
          credit: parsedPayment,
          totalAmount: finalAmount,
        });

        console.log('response :>> ', response);
        console.log('finalAmount :>> ', finalAmount);

        setEmpData((prevState) => ({
          ...prevState,
          userAmount: {
            ...prevState.userAmount,
            totalAmount: finalAmount, // Updating the total amount in state
            remainingAmount: finalAmount // Ensuring remainingAmount is also updated
          }
        }));

        setPayment("");
        fetchEmpData();
      } catch (error) {
        console.error("Error adding payment:", error);
      }
    } else {
      console.error("Please enter a valid payment amount.");
    }
  };

  const exportToPdf = () => {
    const doc = new jsPDF();

    const headers = colDefs.map((col) => col.headerName);
    const rows = gridRef.current.api.getRenderedNodes().map((node) => {
      const srNo = node.rowIndex + 1;
      const date = node.data.createdAt ? new Date(node.data.createdAt).toLocaleDateString() : "";
      return [srNo, date, node.data.credit, node.data.totalAmount];
      // return colDefs.map((col) => node.data[col.field]);
    });

    console.log('rows :>> ', rows);

    // Add the headers
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 20,
      margin: { top: 20 },
      theme: 'grid',
    });

    // Save the PDF
    doc.save('grid-data.pdf');
  };

  useEffect(() => { fetchEmpData() }, []);



  return (
    <>

      <main>
        <section>
          <div className="container">

            {role === "Admin" ?
              <Link to='/manager-dashboard' className="btn btn-dark"> Dashboard </Link>
              : ''}
            <h3 className="text-center">- User's Dashboard - </h3>

            <div className="employee_data my-5">
              <div className="row">

                <div className="col-lg-6 col-md-6 col-sm-12">
                  <div className="d-flex">
                    <div className="pr-3">
                      <h5>ID :</h5>
                      <h5>Name :</h5>
                      <h5>Email :</h5>
                      <h5>Mobile :</h5>
                    </div>
                    <div className="px-3">
                      <h5>{empData ? empData?.user?._id : ""}</h5>
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
                      <h5>Amount :</h5>
                      <h5>Interest :</h5>
                      <h5>Payment :</h5>
                      <h5>Remainig Amount :</h5>
                    </div>
                    <div className="px-3">
                      <h5>
                        {empData ? empData?.userAmount?.credit : "No credit available"}
                      </h5>
                      <h5>{empData ? empData?.userAmount?.interest : ""}</h5>
                      <h5>{empData ? empData?.userAmount?.debit : ""}</h5>
                      <h5>
                        {empData ? empData?.userAmount?.totalAmount : "1"}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr />

            {role === "Admin" ?
              <form onSubmit={paymentSubmit} >
                <div className="d-flex gap-3">
                  <input type="number" value={payment} onChange={(e) => setPayment(e.target.value)} name="payment" className="form-control w-50" placeholder="Enter Daily Amount" id="payment" />
                  <button type="submit" className="btn btn-success">Add</button>
                </div>
              </form> : ''}


            <div style={{ height: 500, marginTop: "50px" }}>
              <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true,
                }}
                ref={gridRef}
              />
            </div>

            <button className="btn btn-success my-4" onClick={exportToPdf}>Export to PDF</button>
          </div>
        </section>
      </main>

    </>
  )
}

export default EmployeeDashboard