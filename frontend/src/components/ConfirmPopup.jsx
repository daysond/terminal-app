
const ConfirmPopup = ({ isOpen, onClose, title, message, confirmAction }) => {

  const cancel = () => {
    onClose()
  }

  return (
    <div className={`popup ${isOpen ? 'open' : ''}`}>
      <div className="popup-content">
        <h2 className='popup-title popup-underline'>{title}</h2>
            <p className='popup-err-msg'>{message}</p>
        <div className='auth-form-button-grp'>
            <button className='auth-button bracket-button sign-in-button' type='button'  onClick={()=> {
                confirmAction()
                onClose()
            }}> {"Yes"}</button>
            <button className="auth-button close-button bracket-button" type='button' onClick={cancel}>{"Cancel"}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
