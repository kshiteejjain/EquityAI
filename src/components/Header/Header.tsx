import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { fetchTotalCredits } from '../../utils/firebaseUtils';
import Button from '../Buttons/Button';
import Strings from '../../utils/en';
import logo from '../../assets/logo.svg';
import defaultProfile from '../../assets/defaultProfile.svg';
import './Header.css';
type Props = {
  isLoginPage?: boolean;
  onClick?: () => void;
};
const Header = ({ isLoginPage }: Props) => {
  const [username, setUsername] = useState('');
  const [remainingCredits, setRemainingCredits] = useState<number | undefined>(undefined);
  const [showCreditDetails, setShowCreditDetails] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const showUsername = (name: string) => {
    const email = name.split('@');
    return email[0];
  };
  const toggleCreditDetails = () => {
    setShowCreditDetails(!showCreditDetails);
  };
  const handleLogout = () => {
    navigate('/');
    sessionStorage.clear();
    localStorage.clear();
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUsername = sessionStorage.getItem('username') ?? 'User';
        setUsername(showUsername(storedUsername));
        // Fetch only setRemainingCredits
        await fetchTotalCredits(storedUsername, undefined, setRemainingCredits, setIsAdmin);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle errors as needed
      }
    };
    fetchData();
    if (remainingCredits !== undefined && remainingCredits <= 0) {
      navigate('/ContactUs');
    }
  }, [remainingCredits, navigate]);
  return (
    <header className="header">
      <div className="container">
        <img src={logo} alt={Strings.header.metaTitle} title={Strings.header.metaTitle} />
        <div className="headerRight">
          {isAdmin && <nav>
            <button onClick={()=> navigate('/Dashboard')}>{Strings.header.dashboard}</button>
          </nav> }
          <div className="username" onClick={toggleCreditDetails}> {Strings.header.welcome} &nbsp; <span> {username} </span>
            <span className='defaultProfile'><img src={defaultProfile} /> </span>
          </div>
          <div className={`creditDetails ${showCreditDetails ? 'visible' : 'hidden'}`}>
            <p>{Strings.header.email}: {sessionStorage.getItem('username')}</p>
            <p>{Strings.header.remainingCredits} {remainingCredits}</p>
            {remainingCredits !== undefined && remainingCredits > 0
              ? (
                <p>
                  <Button title={Strings.header.goToCategory} isSecondary onClick={() => navigate('/Categories')} />
                </p>
              )
              : null
            }
            {isLoginPage ?? <Button title={Strings.header.signOut} isSecondary onClick={handleLogout} />}
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
