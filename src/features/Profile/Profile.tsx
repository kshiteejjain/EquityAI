import Header from '../../components/Header/Header';
import Strings from '../../utils/en';
import logo from '../../assets/logo.svg';

import './Profile.css';

const Profile = () => {
    const storedUserData = JSON.parse(localStorage.getItem('usrAcsData') || '{}');
    const { displayName, email, photoURL } = storedUserData;
    return (
        <>
            <Header />
            <div className='container'>
                <div className='profile-flex'>
                    <div className='profile-cards'>
                        <h2> Profile </h2>
                        <p>{Strings.header.welcome}: &nbsp; <span>{displayName} </span></p>
                        <p>{Strings.header.email}: &nbsp; <span>{email} </span></p>
                        <p> {Strings.header.profile}: <span className='defaultProfile'><img src={photoURL ? photoURL : logo} /> </span></p>
                    </div>
                </div>
            </div>
        </>
    )
};
export default Profile;