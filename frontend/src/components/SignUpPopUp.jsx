import {useState} from 'react';
import { useSignup } from '../hooks/useSignup';

const SignUpPopup = ({ isOpen, onClose }) => {
  // Handle form submission

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {signup, isLoading, error} = useSignup()

  
  // const [err, setErr] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, password, confirmPassword)
  };

  const clearData = () => {
    setEmail("")
    setPassword("")
    setConfirmPassword("")

    onClose()
  }

  return (
    <div className={`popup ${isOpen ? 'open' : ''}`}>
      <div className="popup-content">
        <h2 className='popup-title'>Accept Challenge</h2>
        <form onSubmit={handleSubmit}>
            <div className='sign-in-form-fields'>
            {error && (<h3 className='auth-err-msg'>{error}</h3>)}
            {isLoading && (
              <div className="loader">
                <div className="scanner">
                  <span className='signup-scanner'>Signing up...</span>
                </div>
            </div>
            )}
            <div>
            <label htmlFor="email" className='auth-form-label'>Your Email:</label>
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
            <label htmlFor="password" className='auth-form-label'>Password:</label>
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
            <div>
            <label htmlFor="password" className='auth-form-label'>Confirm Password:</label>
            <input
            className='auth-form-input'
                type="password"
                id="password"
                value={confirmPassword}
                placeholder='Password Again'
                onChange={(e) => setConfirmPassword(e.target.value)}
                // required
            />
            </div>
            </div>

        <div className='auth-form-button-grp'>
            <button disabled={isLoading} className='auth-button bracket-button sign-up-button' type="submit"> {"Sign Up"}</button>
            <button className="auth-button bracket-button close-button" onClick={clearData}>{"Cancel"}</button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPopup;
