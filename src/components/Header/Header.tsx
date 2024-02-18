import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '../Buttons/Button';
import Strings from '../../utils/en';
import logo from '../../assets/logo.svg';

import './Header.css';

type Props = {
  isLoginPage?: boolean;
  onClick?: () => void;
};
const Header = ({ }: Props) => {
  const [showCreditDetails, setShowCreditDetails] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    localStorage.clear();
  };
  const toggleCreditDetails = () => {
    setShowCreditDetails(!showCreditDetails);
  };

  const storedUserData = JSON.parse(localStorage.getItem('usrAcsData') || '{}');
  const { displayName, email, photoURL } = storedUserData;

  return (
    <header className="header">
      <div className="container">
        <img src={logo} alt={Strings.header.metaTitle} title={Strings.header.metaTitle} className='logo' />
        <nav>
          <p onClick={() => navigate('/Home')}> Home </p>
          <p onClick={() => navigate('/Profile')}> Stocks </p>
          <p onClick={() => navigate('/Profile')}> Financial Literacy </p>
        </nav>
        <div className="headerRight">
          <div className="username" onClick={toggleCreditDetails}> {Strings.header.welcome} &nbsp; <span>{displayName} </span>
            <span className='defaultProfile'><img src={photoURL ? photoURL : { logo }} /> </span>
          </div>
          <div className={`creditDetails ${showCreditDetails ? 'visible' : 'hidden'}`}>
            <p><Button title={email} isSecondary onClick={() => navigate('/Profile')} /></p>
            <p><Button title='My profile' isSecondary onClick={() => navigate('/Profile')} /></p>
            <Button title={Strings.header.signOut} isSecondary onClick={handleLogout} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
Header.propTypes = {
  isLoginPage: PropTypes.bool,
};
