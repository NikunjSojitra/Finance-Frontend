import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import ManagerDashboard from "./Components/ManagerDashboard";
import EmployeeDashboard from "./Components/EmployeeDashboard";

function App() {
  const [clickCount, setClickCount] = useState(0);
  const [websiteVisible, setWebsiteVisible] = useState(false);

  const handleClick = () => {
    
    setClickCount(prevClickCount => {
      const newClickCount = prevClickCount + 1;
      if (newClickCount >= 5) {
        setWebsiteVisible(true); 
      }
      return newClickCount;
    });
  };

  return (
    <>
      <div onClick={handleClick} className="App-header">
        {websiteVisible ? (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/manager-dashboard" element={<ManagerDashboard />} />
              <Route path="/employee-dashboard/:id" element={<EmployeeDashboard />} />
            </Routes>
          </BrowserRouter>
        ) : (
          ''
        )}
      </div>
    </>
  );
}

export default App;
