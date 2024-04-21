import "./App.css";
import Login from "./Components/login/LoginForm";
import Signup from "./Components/signup/Signup";
import Name from "./Components/register/Name";
import ManagerDashboard from "./Components/dashboard/ManagerDashboard";
import EmployeeDashboard from "./Components/dashboard/EmployeeDashBoard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Comman/Header";
import { useState } from "react";

function App() {
  const [clickCount, setClickCount] = useState(0);
  const [websiteVisible, setWebsiteVisible] = useState(false);

  const handleClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    // console.log(setClickCount);
    console.log(newClickCount);

    if (newClickCount >= 5) {
      setWebsiteVisible(true);
    }
  };

  return (
    <div className="App" onClick={handleClick}>
      {websiteVisible ? (
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/manager-dashboard" element={<ManagerDashboard />} />
            <Route
              path="/employee-dashboard/:id"
              element={<EmployeeDashboard />}
            />
            <Route path="/user-name" element={<Name />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <h1 style={{ visibility: "hidden" }}>Clicks: {clickCount}</h1>
      )}
    </div>
  );
}

export default App;
