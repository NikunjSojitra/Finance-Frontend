import React, { useState } from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const EmpEditForm = (props) => {
  let data = props?.employeeData;
  const navigate = useNavigate();

  const [fname, setFname] = useState(data.fname);
  const [lname, setLname] = useState(data.lname);
  const [email, setEmail] = useState(data.email);
  const [mobile, setMobile] = useState(data.mobile);
  const [credit, setCredit] = useState(data.credit);
  const [debit, setDebit] = useState(data.debit);
  const [interest, setInterest] = useState(data.interest);
  const [totalAmount, setTotalAmount] = useState(data.totalAmount);

  const handleChanges = async (e) => {
    const empEditData = {
      fname,
      lname,
      email,
      mobile,
      credit,
      debit,
      interest,
      totalAmount,
    };

    e.preventDefault();
    axios
      .patch(`https://finance-backend-jvuy.onrender.com/updateEmpData/${data._id}`, empEditData)
      .then(async (response) => {
        await addCashFlow({ credit: credit, debit: debit, interest: interest, totalAmount: totalAmount, userId: data._id });
        if (response.data.msg) {
          alert(response.data.msg);
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } else {
          alert(response.data.msg);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const addCashFlow = async (submitdata) => {
    console.log(submitdata);
    try {
      const data = await axios.post(
        "https://finance-backend-jvuy.onrender.com/updateEmpData/cash",
        submitdata
      );
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="employe_edit_form">
      {/* <ToastContainer /> */}
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>
            Emp ID : <span className="text-danger">{data._id}</span>
          </Form.Label>
        </Form.Group>

        <div className="col-md-12 row">
          <div className="col-md-6">
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="fname"
                required="required"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                placeholder="ashish"
              />
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lname"
                required="required"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                placeholder="hurmale"
              />
            </Form.Group>
          </div>
        </div>

        <div className="col-md-12 row">
          <div className="col-md-6">
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                required="required"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
              />
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                type="text"
                name="mobile"
                required="required"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 123456789"
              />
            </Form.Group>
          </div>
        </div>

        <div className="col-md-12 row">
          <div className="col-md-6">
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Credit</Form.Label>
              <Form.Control
                type="number"
                name="credit"
                required="required"
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
                placeholder=" + 9999"
              />
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Debit</Form.Label>
              <Form.Control
                type="number"
                name="debit"
                required="required"
                value={debit}
                onChange={(e) => setDebit(e.target.value)}
                placeholder="- 9999"
              />
            </Form.Group>
          </div>
        </div>

        <div className="col-md-12 row">
          <div className="col-md-6">
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Interest</Form.Label>
              <Form.Control
                type="text"
                name="interest"
                required="required"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                placeholder=" + 9999"
              />
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Total</Form.Label>
              <Form.Control
                type="text"
                name="totalAmount"
                required="required"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="= 9999"
              />
            </Form.Group>
          </div>
        </div>

        <div className="col-md-12 row d-flex justify-content-end">
          <div className="col-md-2 text-end px-4">
            <Button onClick={handleChanges}>Update</Button>
          </div>
        </div>
      </Form>
    </div>
  );
};
