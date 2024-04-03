import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <div className="header_wrapper mb-3">
        <div className="container">
          <h1 className="logo">
            <Link to="/"> Company </Link>
          </h1>
        </div>
      </div>
    </>
  );
};

export default Header;
