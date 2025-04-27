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

const PendingUser = () => {
    const [rowData, setRowData] = useState([]);
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    const [colDefs, setColDefs] = useState([
        { valueGetter: 'node.rowIndex + 1', width: 50 },
        {
            headerName: "Name", field: "userName",
            cellRenderer: (params) => (
                <span
                    style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => navigate(`/employee-dashboard/${params.data.user._id}`)}
                >
                    {params.value}
                </span>
            ), width: 120
        },
        // { headerName: "Credit", field: "userAmount.credit" },
        // { headerName: "Debit", field: "userAmount.debit" },
        // { headerName: "Interest %", field: "userAmount.interest" },
        { headerName: "Pending Amount", field: "latestTransaction", width: 120 },

    ]);



    // table data api

    const fetchEmpData = async () => {
        const todayDate = new Date();
        const todayDateString = todayDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        console.log('todayDate', todayDateString);

        setLoader(true);
        try {
            const response = await axios.get("https://finance-backend-jvuy.onrender.com/allEmployeeData");

            const filteredData = response.data.filter((item) => {
                const transactionDate = new Date(item.latestTransaction[0]?.createdAt).toISOString().split('T')[0];
                return transactionDate !== todayDateString; // Keep only if date is NOT today
            });

            const userData = filteredData.map((item) => {
                return {
                    user: item.user,
                    userName: `${item.user.fname} ${item.user.lname}`,
                    userAmount: item.userAmount,
                    latestTransaction: item.latestTransaction[0].totalAmount
                };
            });

            console.log('userData', userData);
            setRowData(userData);
            setLoader(false);
        } catch (error) {
            console.error(error);
            setLoader(false);
        }
    };


    useEffect(() => {
        fetchEmpData();
    }, []);
    return (
        <>
            {loader ?
                <div className="loader-4 center"><span></span></div>
                :
                <section>

                    <div className="container">
                        <div className="header_main my-3">
                            <h1>Pending User List Dashboard</h1>
                            <div className="d-flex gap-3">
                                <Link className="login_btn" to="/manager-dashboard">
                                    Dashboard
                                </Link>
                            </div>
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
                </section >
            }
        </>
    )
}

export default PendingUser