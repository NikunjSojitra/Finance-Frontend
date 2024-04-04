import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import {
  Button,
  Col,
  Dropdown,
  Form,
  InputGroup,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";
import { Modal, ModalFooter, ModalHeader, ModalBody } from "reactstrap";
import { EmpEditForm } from "./EmpEditForm";
import { Link } from "react-router-dom";

const ManagerDashboard = () => {
  const [empData, setEmpData] = useState([]);
  const [cashFlow, setcashFlow] = useState([]);
  const [empDataEdit, setEmpDataEdit] = useState("");
  const [modal, setModal] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  
  let active = 1;
  let items = [];

  for (let number = 1; number <= 5; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>
    );
  }

  useEffect(() => {
    axios
      .get("https://finance-backend-jvuy.onrender.com/allEmployeeData")
      .then((response) => {
        if (response.data) {
          setEmpData(response.data);
          console.warn(response.data);
        } else {
          console.warn(response);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

 

  const deleteData = async (id) => {
    axios
      .delete(`https://finance-backend-jvuy.onrender.com/deleteEmployee/${id}`)
      .then((response) => {
        if (response.data.msg) {
          alert(response.data.msg);
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          alert(response.data.msg);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const empDataFunc = (item) => {
    setEmpDataEdit(item);
  };

  return (
    <>
      <ChakraProvider>
        <div className="manage_table_wrapper">
          <div className="container">
            <Row className="mt-5 text-center">
              <Col>
                <h3>- Manager's Dashboard - </h3>
              </Col>
            </Row>

            <Row className="mt-5 justify-content-end">
              <Col lg={4}  className="text-end mb-sm-2" >
                <Link className="btn sign_up" to="/">
                  Add User
                </Link>
              </Col>
              <Col md={3}>
                <InputGroup>
                  <Form.Control
                    aria-label="Search…"
                    placeholder="Search…"
                    className="search_bar"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <InputGroup.Text>
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </InputGroup.Text>
                </InputGroup>
              </Col>
            </Row>

            <Modal isOpen={modal} className="modal-dialog modal-lg">
              <ModalBody>
                <Row>
                  <Col md={11}>
                    <h3 style={{ textAlign: "center" }}>User's Data</h3>
                  </Col>
                  <Col md={1} className="justify-content-end">
                    <i
                      onClick={() => setModal(!modal)}
                      style={{ cursor: "pointer" }}
                      className="fa fa-remove"
                    ></i>
                  </Col>
                </Row>

                <EmpEditForm employeeData={empDataEdit} />
              </ModalBody>
            </Modal>

            <Row className="mt-3">
              <Col md={12}>
                <div className="table-responsive">
                  <Table bordered className="history">
                    <thead>
                      <tr>
                        <th>Emp ID</th>
                        <th>Employee's Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Credit Amount</th>
                        <th>Debit Amount</th>
                        <th>Interest</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {empData !== []
                        ? empData
                            ?.filter((val) => {
                              if (searchTerm === "") {
                                return val;
                              } else if (
                                val.empID
                                  ?.toLowerCase()
                                  .includes(searchTerm?.toLowerCase()) ||
                                val.email
                                  ?.toLowerCase()
                                  .includes(searchTerm?.toLowerCase()) ||
                                val.fname?.includes(searchTerm) ||
                                val.lname?.includes(searchTerm) ||
                                val.department?.includes(searchTerm) ||
                                val.category?.includes(searchTerm) ||
                                val.salary?.includes(searchTerm) ||
                                val.city
                                  ?.toLowerCase()
                                  .includes(searchTerm?.toLowerCase())
                              ) {
                                return val;
                              }
                            })

                            .map(({user:val,latestTransaction}, index) => {
                              console.log(latestTransaction,'latestTransaction');

                              const last = latestTransaction &&  latestTransaction[0]
                              return (
                                <>
                                  <tr key={index}>
                                    <td><Link to={`/employee-dashboard/${val._id}`}>{val._id}</Link></td>
                                    <td>
                                      {val.fname} {val.lname}
                                    </td>
                                    <td>{val.email}</td>
                                    <td>{val.mobile}</td>
                                    <td>{last?.credit ||0}</td>
                                    <td>{last?.debit ||0}</td>
                                    <td>{last?.interest ||0}</td>
                                    <td>{last?.totalAmount ||0}</td>
                                    <td className="d-flex">
                                      <span
                                        onClick={() => {
                                          setModal(!modal);
                                          empDataFunc(val);
                                        }}
                                        style={{
                                          cursor: "pointer",
                                          color: "blue",
                                          padding: "4px",
                                          margin: "3px",
                                        }}
                                      >
                                        <i className="fa-solid fa-pen-to-square"></i>
                                      </span>
                                      <span
                                        onClick={() => deleteData(val._id)}
                                        style={{
                                          cursor: "pointer",
                                          color: "red",
                                          padding: "4px",
                                          margin: "3px",
                                        }}
                                      >
                                        <i className="fa-solid fa-trash"></i>
                                      </span>
                                    </td>
                                  </tr>
                                </>
                              );
                            })
                        : ""}
                    </tbody>
                  </Table>
                </div>

                <Pagination size="sm" className="justify-content-end mt-2">
                  {items}
                </Pagination>
              </Col>
            </Row>
          </div>
        </div>
      </ChakraProvider>
    </>
  );
};

export default ManagerDashboard;
