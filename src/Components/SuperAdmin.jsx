import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  SelectEditorModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  SelectEditorModule,
  ValidationModule,
]);
function SuperAdmin() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [id, setId] = useState('');

    const [rowData, setRowData] = useState([]);
    const [adminId, setAdminId] = useState(null);
    const [colDefs, setColDefs] = useState([
        { valueGetter: 'node.rowIndex + 1', width: 50 },
        {headerName: "Email", field: "email",},
        {headerName: "Name",valueGetter: 'data.fname + " " + data.lname',},
        {headerName: "Mobile", field: "mobile",},
        {headerName: "Role", field: "role",
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['Admin', 'User'] 
            }
        },
    ]);


    const handleSubmit = async (e) => {
        const empEditData = {
            email,
            userId: id,
        };

        try {
            const response = await axios.get(
                `https://finance-backend-jvuy.onrender.com/allEmployeeData`,
                empEditData
            );

            if (response.status === 200) {
                try {
                    const users = response.data.map((user) => user.user);
                    setRowData(users);
                    console.log('users', users)
                } catch (postError) {
                    console.error("Error:", postError);
                    alert("User data updated, but cash flow update failed.");
                }
            } else {
                alert("Failed to update employee data.");
            }
        } catch (err) {
            console.error("Error updating employee data:", err);
            alert("Something went wrong while updating the user.");
        } 
    };
     const handleCellChange = async (e) => {
        console.log('e', e.data._id)
        const id = e.data._id;
        const empEditData = {
        role : e.data.role,    
        userId: e.data._id,
        };

        try {
        // Update employee data
        const response = await axios.patch(
            `https://finance-backend-jvuy.onrender.com/updateEmpData/${id}`,
            empEditData
        );

        console.log('response :>> ', response);

        if (response.status === 200) {
            try {
            console.log("User role updated successfully.");
            } catch (postError) {
            console.error("Error updating data:", postError);
            alert("User data updated");
            }
        } else {
            alert("Failed to update employee data.");
        }
        } catch (err) {
        console.error("Error updating employee data:", err);
        alert("Something went wrong while updating the user.");
        } 
    };


    useEffect(() => {
        handleSubmit();
    }, []);
    return (
        <>
            {loading ?
                <div className="loader-4 center"><span></span></div> :
                <div className="signup d-flex ">
                    <div className="container">
                         <div className="header_main my-3">
                            <h1>Super Admin</h1>
                            {/* <div className="d-flex gap-3">
                                <Link className="login_btn" to="/manager-dashboard">
                                    Dashboard
                                </Link>
                            </div> */}
                        </div>

                        <div style={{ height: 500, marginTop: "50px" }}>
                            <AgGridReact
                                rowData={rowData}
                                columnDefs={colDefs}
                                defaultColDef={{
                                    sortable: true,
                                    filter: true,
                                    resizable: true,
                                    singleClickEdit: true,
                                }}
                                onCellValueChanged={handleCellChange}

                            />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default SuperAdmin