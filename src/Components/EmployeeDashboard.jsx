/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { useParams } from "react-router-dom";
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import deleteimg from "./../assets/delete.png";
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
  const [paydate, setPaydate] = useState([ new Date().toISOString().split("T")[0] ]);
  const [rowData, setRowData] = useState([]);
  const [empData, setEmpData] = useState([]);
  const [role, setRole] = useState("");
  const [loader, setLoader] = useState(false);

  const [colDefs, setColDefs] = useState([
    {  valueGetter: 'node.rowIndex + 1', width: 50 },
    {
      headerName: "Date",
      field: "date", 
      valueFormatter: (params) =>
        params.value
          ? new Date(params.value).toLocaleDateString()
          : params.data.createdAt
          ? new Date(params.data.createdAt).toLocaleDateString()
          : "",
      width: 120,
    },
    { headerName: "Daily Amount	", field: "credit", width: 120 },
    { headerName: "Remaining Amount	", field: "totalAmount", width: 120 },
    {
          headerName: "Action", field: "",
          cellRenderer: (params) => {
            console.log('params', params.data._id)
            return (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                {/* Delete Icon */}
                <img
                  src={deleteimg}
                  alt="Delete"
                  style={{ width: '25px', height: '25px', cursor: 'pointer', marginTop: '7px' }}
                  onClick={() => {
                    const transId = params.data._id;  
                    console.log('Deleting user with ID:', transId);
                    deleteData(transId);
                  }}
                />
              </div>
            );
          }, width: 80
        },
  ])
  const gridRef = useRef(null);

  const fetchEmpData = async () => {
    setLoader(true);
    try {
      const response = await axios.get("http://localhost:8000/allEmployeeData");
      const userData = response.data.find((e) => e.user._id === id);
      const userName = `${userData.user.fname} ${userData.user.lname}`;

      const role = localStorage.getItem("role");
      setRole(role);
      if (userData && userData.latestTransaction) {
        setEmpData(userData);
        setRowData(userData.latestTransaction);
        setLoader(false);
      } else {
        console.warn("No transactions found for this user.");
        setRowData([]);
        setLoader(false);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const paymentSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();
    const parsedPayment = parseFloat(payment);
    const totalPendingAmount = empData.userAmount.totalAmount;
    const lastAddedAmount = empData.latestTransaction[0]?.totalAmount;
    let finalAmount;
  
    if (!isNaN(parsedPayment) && parsedPayment > 0) {
      if (lastAddedAmount) {
        finalAmount = lastAddedAmount - parsedPayment;
      } else {
        finalAmount = totalPendingAmount - parsedPayment;
      }
  
      const transactionDate = paydate ;
  
      try {
        // Update employee data
        const response = await axios.post("http://localhost:8000/updateEmpData/cash", {
          userId: id,
          credit: parsedPayment,
          date: transactionDate, 
          totalAmount: finalAmount,
        });
  
        const newTransaction = {
          credit: parsedPayment,
          date: transactionDate,
          totalAmount: finalAmount,
        };
  
        // setRowData((prevRowData) => [newTransaction, ...prevRowData]);
  
        setEmpData((prevState) => ({
          ...prevState,
          userAmount: {
            ...prevState.userAmount,
            totalAmount: finalAmount, 
            remainingAmount: finalAmount, 
          },
        }));
  
        setPayment("");
        setPaydate(new Date().toISOString().split("T")[0]);
        fetchEmpData(); 
        setLoader(false);
      } catch (error) {
        console.error("Error adding payment:", error);
      }
    } else {
      console.error("Please enter a valid payment amount.");
    }
  };


  const deleteData = async (transId) => {
    try {
      console.log("Deleting transaction with ID:", transId); 
      const response = await axios.delete(`http://localhost:8000/deletetransaction/${transId}`);
      console.log('trans :', response.data);
  
      if (response.data.msg) {
        alert(response.data.msg);
        fetchEmpData(); 
      } else {
        alert("Failed to delete the transaction. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting data:", err.response ? err.response.data : err.message);
      alert("An error occurred while deleting the transaction. Please check the console for details.");
    }
  };
  

  const exportToPdf = () => {
    const doc = new jsPDF();

    const headers = colDefs.map((col) => col.headerName);
    const rows = gridRef.current.api.getRenderedNodes().map((node) => {
      const srNo = node.rowIndex + 1;
      const date = node.data.createdAt ? new Date(node.data.createdAt).toLocaleDateString() : "";
      return [srNo, date, node.data.credit, node.data.totalAmount];
    });


    // Add the headers
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 20,
      margin: { top: 20 },
      theme: 'grid',
    });

    // Save the PDF
    doc.save(`${empData.user.fname}-${empData.user.lname}.pdf`);
  };

  useEffect(() => { fetchEmpData() }, []);



  return (
    <>
    {loader ?
      <div className="loader-4 center"><span></span></div>  
        :

      <main className="my-4"> 
        <section>
          <div className="container">

            {role === "Admin" ?
              <Link to='/manager-dashboard' className="btn btn-dark mb-3"> Dashboard </Link>
              : ''}
            <h3 className="text-center">- User's Dashboard - </h3>

            <div className="employee_data my-5">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12">
                  <table border="1" className="table table-bordered">
                    <tbody>
                      <tr>
                        <td style={{ width: '100px' }}>Name</td>
                        <td>
                          <h5>
                            {empData?.user
                              ? `${empData?.user?.fname} ${empData?.user?.lname}`
                              : ""}
                          </h5>
                        </td>
                      </tr>
                      <tr>
                        <td>Email</td>
                        <td>
                          <h5>{empData?.user ? empData?.user?.email : ""}</h5>
                        </td>
                      </tr>
                      <tr>
                        <td>Mobile</td>
                        <td>
                          <h5>{empData?.user ? empData?.user?.mobile : ""}</h5>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12">
                  <table border="1" className="table table-bordered ">
                    <tbody>
                      <tr>
                        <td style={{ width: '100px' }}>Amount</td>
                        <td>
                          <h5>
                            {empData ? empData?.userAmount?.credit : "No credit available"}
                          </h5>
                        </td>
                      </tr>
                      <tr>
                        <td>Interest</td>
                        <td>
                          <h5>{empData ? empData?.userAmount?.interest : ""}</h5>
                        </td>
                      </tr>
                      <tr>
                        <td>Payment </td>
                        <td>
                          <h5>{empData ? empData?.userAmount?.debit : ""}</h5>
                        </td>
                      </tr>
                      <tr>
                        <td>Remainig Amount</td>
                        <td>
                          <h5>
                            {empData ? empData?.userAmount?.totalAmount : "1"}
                          </h5>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <hr />

            {role === "Admin" ?
             <form onSubmit={paymentSubmit}>
             <div className="d-lg-flex d-sm-block gap-3">
               <input
                 type="number"
                 value={payment}
                 onChange={(e) => setPayment(e.target.value)}
                 name="payment"
                 className="form-control w-75 mb-lg-0 mb-2"
                 placeholder="Enter Daily Amount"
                 id="payment"
                 required
               />
               <input
                 type="date"
                 value={paydate}
                 onChange={(e) => setPaydate(e.target.value)}
                 name="paydate"
                 className="form-control w-75 mb-lg-0 mb-2"
                 placeholder="date"
                 id="paydate"
               />
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
}
    </>
  )
}

export default EmployeeDashboard