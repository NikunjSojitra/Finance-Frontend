/* eslint-disable no-unused-vars */

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import editimg from "./../assets/edit.png";
import deleteimg from "./../assets/delete.png";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from 'react-router-dom'; 
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

function ManagerDashboard() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [credit, setCredit] = useState("");
  const [debit, setDebit] = useState("");
  const [interest, setInterest] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [id, setId] = useState('');
  const [modal, setModal] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const navigate = useNavigate();
  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { headerName: 'Sr. No.', valueGetter: 'node.rowIndex + 1', width: 100 },
    { headerName: "Name", field: "userName",
      cellRenderer: (params) => (
        <span
          style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
          onClick={() => navigate(`/employee-dashboard/${params.data.user._id}`)}
        >
          {params.value}
        </span>
      ),
       },
    { headerName: "Credit", field: "userAmount.credit" },
    { headerName: "Debit", field: "userAmount.debit" },
    { headerName: "Interest %", field: "userAmount.interest" },
    { headerName: "Total Amount", field: "userAmount.totalAmount" },
    { headerName: "Created Date", field: "userAmount.createdAt",valueFormatter: (params) =>
      params.value ? new Date(params.value).toLocaleDateString() : "" },
    { headerName: "id", field: "user._id" },
    {
      headerName: "Action", field: "",
      cellRenderer: (params) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {/* Edit Icon */}
            <img
              src={editimg}
              alt="Edit"
              style={{ width: '30px', height: '30px', cursor: 'pointer' }}
              onClick={() => toggleModal('edit', params.data)}
            />
            {/* Delete Icon */}
            <img
              src={deleteimg}
              alt="Delete"
              style={{ width: '30px', height: '30px', cursor: 'pointer' }}
              onClick={() => {
                deleteData(params.data.user._id);
              }}
            />
          </div>
        );
      }
    },
  ]);

  const toggleModal = (action, user = null) => {
    if (user) {
      setSelectedUser(user);
    }
    setModal(!modal);
  };

  // user finacial data api

  const handleSubmit = async (e) => {

    const id = selectedUser.user._id;

    e.preventDefault();

    // Prepare the data for the update
    const empEditData = {
      fname: fname,
      lname,
      email,
      mobile,
      credit,
      debit,
      interest,
      totalAmount,
    };

    try {
      // Perform the patch request to update employee data
      const response = await axios.patch(
        `https://finance-backend-jvuy.onrender.com/updateEmpData/${id}`,
        empEditData
      );

      if (response.data.msg) {
        await addUserAmountFlow({
          credit,
          debit,
          interest,
          totalAmount,
          userId: id,  
        });
        setModal(!modal);
        fetchEmpData();  

      } else {
        alert(response.data.msg);
      }
    } catch (err) {
      console.error("Error updating employee data:", err);
    }
  };

  const addUserAmountFlow = async (submitdata) => {
    try {
      const data = await axios.post(
        "https://finance-backend-jvuy.onrender.com/updateEmpData/usercash",
        submitdata
      );
      console.log("User Amount Flow Added:", data);
    } catch (error) {
      console.log("Error adding user amount flow:", error);
    }
  };
  // finacial data api

  // table data api

  const fetchEmpData = async () => {
    try {
      const response = await axios.get("https://finance-backend-jvuy.onrender.com/allEmployeeData");
      const userData = response.data.map((item) => {
        return {
          user: item.user,
          userName: `${item.user.fname} ${item.user.lname}`,
          userAmount: item.userAmount,
        }
      }
      );
      setRowData(userData)
    }
    catch (error) {
      console.error(error);
    };
  }

  useEffect(() => {
    fetchEmpData();
  }, []);
  // table data api

  // delete user
  const deleteData = async (id) => {
    try {
      console.log("Deleting user with ID:", id); 
      const response = await axios.delete(`https://finance-backend-jvuy.onrender.com/deleteEmployee/${id}`);
      console.log('Delete Response:', response.data);

      if (response.data.msg) {
        alert(response.data.msg);
        setTimeout(() => {
          fetchEmpData(); // Refresh the data after deleting
        }, 3000);
      } else {
        alert("Failed to delete the employee. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting data:", err.response ? err.response.data : err.message);
      alert("An error occurred while deleting the employee. Please check the console for details.");
    }
  };

  // delete user


  useEffect(() => {
    if (selectedUser) {
      setId(selectedUser.user._id);
      setFname(selectedUser.user.fname);
      setLname(selectedUser.user.lname);
      setEmail(selectedUser.user.email);
      setMobile(selectedUser.user.mobile);
      setCredit(selectedUser.userAmount?.credit || '');
      setDebit(selectedUser.userAmount?.debit || '');
      setInterest(selectedUser.userAmount?.interest || '');
      setTotalAmount(selectedUser.userAmount?.totalAmount || '');
    }
  }, [selectedUser]);


  return (
    <>
      <main className="my-5">
        <section>
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <h1>Manager Dashboard</h1>
              <Link className="login_btn" to="/signup">
                Add User
              </Link>
            </div>

            <div style={{ height: 500, marginTop: "50px" }}>
              <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true,
                }}
              />
            </div>
          </div>
        </section>
      </main>

      {/* add user modal */}

      <div
        className={`modal fade ${modal ? "show" : ""}`}
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        style={{ display: modal ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h2>User Edit</h2>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={toggleModal}
              ></button>
            </div>
            <div className="modal-body">
              <div className="employe_edit_form">
                <form onSubmit={handleSubmit}>
                  {selectedUser && (
                    <>
                      <div className="mb-3">
                        <label>
                          Emp ID: <span className="text-danger">{selectedUser.user._id}</span>
                        </label>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label>First Name</label>
                            <input
                              type="text"
                              name="fname"
                              required="required"
                              value={fname}
                              onChange={(e) => setFname(e.target.value)}
                              placeholder="First Name"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label>Last Name</label>
                            <input
                              type="text"
                              name="lname"
                              required="required"
                              value={lname}
                              onChange={(e) => setLname(e.target.value)}
                              placeholder="Last Name"
                              className="form-control"
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label>Email</label>
                            <input
                              type="email"
                              name="email"
                              required="required"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="example@gmail.com"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label>Mobile</label>
                            <input
                              type="text"
                              name="mobile"
                              required="required"
                              value={mobile}
                              onChange={(e) => setMobile(e.target.value)}
                              placeholder="+91 123456789"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label>Loan / લોનની રકમ</label>
                            <input
                              type="number"
                              name="credit"
                              required="required"
                              value={credit}
                              onChange={(e) => setCredit(e.target.value)}
                              placeholder="+ 9999"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label>કાપેલા વ્યાજની રકમ</label>
                            <input
                              type="number"
                              name="debit"
                              required="required"
                              value={debit}
                              onChange={(e) => setDebit(e.target.value)}
                              placeholder="- 9999"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label>Interest / વ્યાજ</label>
                            <input
                              type="text"
                              name="interest"
                              required="required"
                              value={interest}
                              onChange={(e) => setInterest(e.target.value)}
                              placeholder="+ 9999"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label>Total / રકમ</label>
                            <input
                              type="text"
                              name="totalAmount"
                              required="required"
                              value={totalAmount}
                              onChange={(e) => setTotalAmount(e.target.value)}
                              placeholder="= 9999"
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-success">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default ManagerDashboard;
