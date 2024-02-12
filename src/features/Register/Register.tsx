import Strings from '../../utils/en';
import logo from '../../assets/logo.svg';
import googleLogo from '../../assets/google.svg';
import facebookLogo from '../../assets/facebook.svg';
import twitterLogo from '../../assets/twitter.svg';
import appleLogo from '../../assets/apple.svg';
import yahooLogo from '../../assets/yahoo.svg';
import emailLogo from '../../assets/email.svg';
import './Register.css';
const Register = () => {
    return (
        <div className='login-wrapper'>
            <div className='login-form'>
                <img src={logo} alt="Logo" className="login-logo" />
                <h1>{Strings.register.title}</h1>
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
                    <p className="description-qD3tmqQv">Do not have an account? <a className="link-qD3tmqQv" href="#">Sign In</a></p>
                </div>
            </div>
        </div>
    )
};
export default Register;