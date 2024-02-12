import Strings from '../../utils/en';
import LoginImages from "../../components/LoginImages/LoginImages";
import logo from '../../assets/logo.svg';
import googleLogo from '../../assets/google.svg';
import facebookLogo from '../../assets/facebook.svg';
import twitterLogo from '../../assets/twitter.svg';
import appleLogo from '../../assets/apple.svg';
import yahooLogo from '../../assets/yahoo.svg';
import emailLogo from '../../assets/email.svg';

import './Login.css';
import Register from "../Register/Register";

const Login = () => {
    return (
        <div className='login-wrapper'>
            <LoginImages />
            <div className='login-form'>
                <img src={logo} alt="Logo" className="login-logo" />
                <h1>{Strings.login.title}</h1>
                <div className="social-login">
                    <button className="social-login-button"> <img src={googleLogo} /> <span> Login From Google</span> </button>
                    <div className="social-login-icons">
                        <button className="social-login-button"> <img src={facebookLogo} /> </button>
                        <button className="social-login-button"> <img src={twitterLogo} /> </button>
                        <button className="social-login-button"> <img src={appleLogo} /> </button>
                        <button className="social-login-button"> <img src={yahooLogo} /> </button>
                    </div>
                    <div className="separator"><div className="separator-text   ">or</div></div>
                    <div className="social-login-email">
                        <button className="social-login-button"> <img src={emailLogo} /> Email</button>
                    </div>
                </div>
                <div className="login-footer">
                    <p className="description-qD3tmqQv">Do not have an account? <a className="link-qD3tmqQv" href="#">Sign up</a></p>
                </div>
                {/* <form onSubmit={uploadDataToFirestore}>
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
                    <Button isSecondary title={Strings.login.register} type="button" onClick={() => navigate('/Register')} />
                    {loader && <Loader />}
                </div> */}
            </div>
            <Register />
        </div>
    )
};
export default Login;