import {useState} from 'react';
import { useLogin } from '../hooks/useLogin';

const SignInPopup = ({ isOpen, onClose }) => {
  // Handle form submission

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const {login, isLoading, error} = useLogin()

  const clearData = () => {
    setEmail("")
    setPassword("")
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform sign-in logic
    await login(email, password)
  };

  return (
    <div className={`popup ${isOpen ? 'open' : ''}`}>
      <div className="popup-content">
        <h2 className='popup-title'>Sign In</h2>
        <form onSubmit={handleSubmit}>
            <div className='sign-in-form-fields'>
            {error && (<h3 className='auth-err-msg'>{error}</h3>)}
            {isLoading && (
              <div className="loader">
                <div className="scanner">
                  <span className='login-scanner'>Logging in...</span>
                </div>
            </div>
            )}
            <div>
            <label className='auth-form-label'>Your Email:</label>
            <input
                className='auth-form-input'
                type="email"
                id="email"
                value={email}
                placeholder='Email'
                onChange={(e) => setEmail(e.target.value)}
                // required
            />
            </div>
            <div>
            <label className='auth-form-label'>Password:</label>
            <input
            className='auth-form-input'
                type="password"
                id="password"
                value={password}
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
                // required
            />
            </div>
            </div>

        <div className='auth-form-button-grp'>
            <button disabled={isLoading} className='auth-button bracket-button sign-in-button' type="submit"> {"Sign In"}</button>
            <button className="auth-button close-button bracket-button" type='button' onClick={clearData}>{"Cancel"}</button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default SignInPopup;
