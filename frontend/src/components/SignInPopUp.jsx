import {useState} from 'react';

const SignInPopup = ({ isOpen, onClose }) => {
  // Handle form submission

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null)

  const clearData = () => {
    setEmail("")
    setPassword("")
    setErr("")
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform sign-in logic
    console.log(email)
    setErr(email)
  };

  return (
    <div className={`popup ${isOpen ? 'open' : ''}`}>
      <div className="popup-content">
        <h2 className='popup-title'>Sign In</h2>
        <form onSubmit={handleSubmit}>
            <div className='sign-in-form-fields'>
            {err && (<h3 className='auth-err-msg'>{err}</h3>)}
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
            <button className='auth-button sign-in-button  bracket-button' type="submit"> {"Sign In"}</button>
            <button className="auth-button close-button bracket-button" onClick={clearData}>{"Cancel"}</button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default SignInPopup;
