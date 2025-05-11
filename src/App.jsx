import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import ManagerDashboard from "./Components/ManagerDashboard";
import EmployeeDashboard from "./Components/EmployeeDashboard";
import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase';
import PendingUser from "./Components/PendingUser";


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

  // useEffect(() => {
  //   // Ask for notification permission
  //   Notification.requestPermission().then((permission) => {
  //     if (permission === 'granted') {
  //       getToken(messaging, {
  //         vapidKey: 'YOUR_PUBLIC_VAPID_KEY',
  //       })
  //         .then((currentToken) => {
  //           if (currentToken) {
  //             console.log('FCM Token:', currentToken);
  //             // ✅ Send token to your backend to save
  //           } else {
  //             console.log('No registration token available.');
  //           }
  //         })
  //         .catch((err) => {
  //           console.log('An error occurred while retrieving token.', err);
  //         });
  //     }
  //   });

  //   // Handle foreground messages
  //   onMessage(messaging, (payload) => {
  //     console.log('Message received in foreground: ', payload);
  //     alert(payload.notification?.title || 'New Notification');
  //   });
  // }, []);


  // useEffect(() => {
  //   if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker
  //       .register('/firebase-messaging-sw.js')
  //       .then((registration) => {
  //         console.log('Service Worker registered:', registration);
  //       })
  //       .catch((error) => {
  //         console.error('Service Worker registration failed:', error);
  //       });
  //   }
  // }, []);

  return (
    <>
      <div onClick={handleClick} className="App-header">
        {websiteVisible ? (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/manager-dashboard" element={<ManagerDashboard />} />
              <Route path="/pending-user" element={<PendingUser />} />
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
