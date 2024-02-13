import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Strings from '../../utils/en';
import LoginImages from "../../components/LoginImages/LoginImages";
import Button from "../../components/Buttons/Button";
import showPassword from '../../assets/showPassword.svg';
import hidePassword from '../../assets/hidePassword.svg';
import logo from '../../assets/logo.svg';
import close from '../../assets/close.svg';

import './ForgotPassword.css';

const LoginWithEmail = () => {
    const navigate = useNavigate();
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [userDetails, setUserDetails] = useState({
        email: '',
        password: ''
    });
    const handleTogglePasswordVisibility = () => setIsShowPassword((isOpen: any) => !isOpen);
    const handleSignIn = () => navigate('/');
    return (
        <div className='login-wrapper'>
            <LoginImages />
            <div className='login-wrapper-inner'>
                <img src={close} alt="Close" className="close-icon" onClick={handleSignIn} />
                <form className='login-form-custom'>
                    <img src={logo} alt="Logo" className="login-logo" />
                    <h1>{Strings.ForgotPassword.title}</h1>
                    <div className='form-group'>
                        <label htmlFor='email'>{Strings.ForgotPassword.email}</label>
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
                        <label htmlFor='password'>{Strings.ForgotPassword.password}</label>
                        <input
                            type={isShowPassword ? 'text' : 'password'}
                            className='form-control'
                            required
                            name="password"
                            value={userDetails.password}
                            onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                        />
                        <div className="togglePassword" onClick={handleTogglePasswordVisibility}>
                            {isShowPassword ? <img src={hidePassword} /> : <img src={showPassword} />}
                        </div>
                    </div>
                    <Button title={Strings.ForgotPassword.buttonTitle} type="submit" />
                </form>
                <div className="login-footer">
                        <p className="description-qD3tmqQv">Already have an account? <button onClick={handleSignIn}>Sign in</button></p>
                </div>
            </div>
        </div>
    )
};
export default LoginWithEmail;