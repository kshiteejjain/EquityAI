import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './features/Login/Login';
import ForgotPassword from './features/ForgotPassword/ForgotPassword';
import './App.css';

type Props = {
  isLoggedIn: boolean
};
const isLoggedIn = JSON.parse(sessionStorage.getItem('isLoggedIn') || 'true');
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
    if (sessionStorage.length <= 0) {
      navigate('/');
    }
  }, [navigate]);
  return (
    <Routes>
      {isLoggedIn ? (
        <>
          <Route path="/" element={<Login />} />
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
