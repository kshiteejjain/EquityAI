import Home from '../../assets/home.svg';
import Profile from '../../assets/profile.svg';
import Stock from '../../assets/stock.svg';
import Watch from '../../assets/eyes.svg';
import Simulate from '../../assets/simulate.svg';

import './SideMenu.css';

const SideMenu = () => {
    return(
        <ul className='sidemenu'>
            <li> <img src={Home} /> Home</li>
            <li> <img src={Stock} /> Stocks</li>
            <li> <img src={Simulate} /> Simulate</li>
            <li> <img src={Watch} /> Watch List</li>
            <li> <img src={Profile} /> Profile </li>
        </ul>
    )
};
export default SideMenu;