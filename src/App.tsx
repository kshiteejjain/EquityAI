import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './features/Login/Login';
import ForgotPassword from './features/ForgotPassword/ForgotPassword';
import Home from './features/Home/Home';
import Profile from './features/Profile/Profile';

import './App.css';


type Props = {
  isLoggedIn: boolean;
};

const isLoggedIn = JSON.parse(localStorage.getItem('acTkn') || 'true');

function App() {
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/*" element={<MainApp isLoggedIn={isLoggedIn} />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

function MainApp({ isLoggedIn }: Props) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return (
    <Routes>
      {isLoggedIn ? (
        <>
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Profile" element={<Profile />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Login />} />
        </>
      )}
    </Routes>
  );
}

export default App;
