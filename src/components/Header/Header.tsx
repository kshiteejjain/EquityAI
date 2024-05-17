import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { resetGeneratedData } from '../../features/APIServices/QuestionGeneratorSlice';
import Button from '../Buttons/Button';
import Strings from '../../utils/en';
import logo from '../../assets/logo.svg';
import Down from '../../assets/down.svg';
import Notification from '../../assets/notification.svg';
import Hamburger from '../../assets/menu.svg';

import './Header.css';
import { useDispatch } from 'react-redux';
//import HeaderSearch from '../HeaderSearch/HeaderSearch';

type Props = {
  isLoginPage?: boolean;
  isMenu?: boolean,
  isMenuOpen?: boolean,
  setIsMenuOpen?: (isOpen: boolean) => void;
  onClick?: () => void;
};
const Header = ({ isMenu = true, isMenuOpen = true, setIsMenuOpen }: Props) => {
  const [showCreditDetails, setShowCreditDetails] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    navigate('/');
    localStorage.clear();
    dispatch(resetGeneratedData())
  };
  const toggleCreditDetails = () => {
    setShowCreditDetails(!showCreditDetails);
  };
  const handleSideMenu = () => {
    if (setIsMenuOpen) {
      setIsMenuOpen(!isMenuOpen);
    }
  }

  const storedUserData = JSON.parse(localStorage.getItem('usrAcsData') || '{}');
  const { displayName, email, photoURL } = storedUserData;
  return (
    <header className="header">
      <div className="container">
        <img src={Hamburger} alt='Menu' title='Menu' className='hamburger' onClick={handleSideMenu} />
        <img src={logo} alt={Strings.header.metaTitle} title={Strings.header.metaTitle} className='logo' onClick={() => navigate('/Home')} />
         
        <div className="headerRight">
          <div className='select-language'>
            <select className='form-control'>
              <option>English</option>
              <option>French</option>
              <option>German</option>
              <option>Japanese</option>
            </select>
          </div>
          <div className='notifications'>
            <img src={Notification} /> <span className='count'>10</span>
          </div>
          <div className="username" onClick={toggleCreditDetails}> <span className='welcome-text'>{Strings.header.welcome} &nbsp; <span>{displayName ? displayName : email?.split('@')[0]} </span> </span>
            <span className='defaultProfile'><img src={photoURL ? photoURL : logo} /> </span>
            <img src={Down} className='down-image' />
          </div>
          <div className={`creditDetails ${showCreditDetails ? 'visible' : 'hidden'}`}>
            {isMenu &&
              <><p><Button title={email} isSecondary onClick={() => navigate('/Profile')} /></p>
                <p><Button title='My profile' isSecondary onClick={() => navigate('/Profile')} /></p>
              </>
            }
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
