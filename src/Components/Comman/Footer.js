import React from "react";

const Footer = () => {
  const today = new Date();
  const year = today.getFullYear();
  return (
    <>
      <footer>
        <div className="footer_wrapper">
          <div className="">
            <div>
              <p> Copyright &#169; {year}, society name</p>
            </div>
          </div>
        </div>
      </footer>

    
    </>
  );
};

export default Footer;
