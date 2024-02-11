import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from '../../components/Buttons/Button';
import Strings from '../../utils/en';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import LoginImages from "../../components/LoginImages/LoginImages";
import Loader from "../../components/Loader/Loader";
import ShowPassword from '../../assets/showPassword.svg';
import HidePassword from '../../assets/hidePassword.svg'
import './Login.css';

const Login = () => {
    const [userDetails, setUserDetails] = useState({
        email: '',
        password: ''
    });
    const [loader, setLoader] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const handleForgotPassword = () => {
        navigate('/ForgotPassword')
    }
    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const uploadDataToFirestore = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoader(true);
        try {
            const collectionRef = collection(firestore, 'RegisteredUsers');
            // Check if a document with the given email and password exists
            const q = query(
                collectionRef,
                where('email', '==', userDetails.email),
                where('password', '==', userDetails.password)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                // Document with this email and password exists
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const remainCredits = data?.remain_credits;
                    const isActiveUser = data?.isActiveUser;
                    sessionStorage.setItem("isLoggedIn", String(true));
                    sessionStorage.setItem("username", data?.email);
                    setLoader(false);
                    if (remainCredits <= 0 || isActiveUser === false) {
                        navigate("/ContactUs");
                    } else {
                        navigate("/Categories");
                    }
                });
            } else {
                // No document with this email and password found
                alert('You have entered wrong username and password');
                setLoader(false);
            }
        } catch (error) {
            alert('Error querying data from Firestore: ' + error);
            setLoader(false);
        }
    };
    return (
        <div className='login-wrapper'>
            <div className='login-form'>
                <h1>{Strings.login.title}</h1>
                <form onSubmit={uploadDataToFirestore}>
                    <div className='form-group'>
                        <label htmlFor='gradeLevel'>{Strings.login.email}</label>
                        <input
                            type='email'
                            autoComplete="off"
                            className='form-control'
                            required
                            name="email"
                            value={userDetails.email}
                            onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='gradeLevel'>{Strings.login.password}</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className='form-control'
                            required
                            name="password"
                            value={userDetails.password}
                            onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                        />
                        <div className="togglePassword" onClick={handleTogglePasswordVisibility}>
                            {showPassword ? <img src={HidePassword} /> : <img src={ShowPassword} />}
                        </div>
                    </div>
                    <Button title={Strings.login.buttonLogin} type="submit" />
                </form>
                <div className="additional-actions">
                    <Button title={Strings.ForgotPassword.title} isSecondary type="button" onClick={handleForgotPassword} />
                    <Button isSecondary title={Strings.login.register} type="button" onClick={()=> navigate('/Register')} />
                    {loader && <Loader />}
                </div>
            </div>
            <LoginImages />
        </div>
    )
};
export default Login;