import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Strings from '../../utils/en';
import Button from "../../components/Buttons/Button";
import showPassword from '../../assets/showPassword.svg';
import hidePassword from '../../assets/hidePassword.svg';


const LoginWithEmail = () => {
    const navigate = useNavigate();
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [userDetails, setUserDetails] = useState({
        email: '',
        password: ''
    });
    const handleTogglePasswordVisibility = () => setIsShowPassword((isOpen: any) => !isOpen);
    const handleForgotPassword = () => navigate('/ForgotPassword')
    return (
        <form className='login-form-custom'>
            <div className='form-group'>
                <label htmlFor='gradeLevel'>{Strings.signIn.email}</label>
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
                <label htmlFor='gradeLevel'>{Strings.signIn.password}</label>
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
            <Button title={Strings.signIn.buttonLogin} type="submit" />
            <div className="additional-actions">
                <Button title={Strings.ForgotPassword.title} isSecondary type="button" onClick={handleForgotPassword} />
            </div>
        </form>
    )
};
export default LoginWithEmail;