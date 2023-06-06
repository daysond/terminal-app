import './auth.css'
import './error.css'


export const ErrorPage = ({error}) => {
    console.log("error page", error)
    const style = {
        "display": "none"
    }
    return(
        <div className='error-page'>
            <h1 className='auth-page-title error-title'>{"<Error />"}</h1>
            <h2 className='error-code'> {error?.status ? error.status : "Unknown"}</h2>
            <div className="wrapper">
            <p className='auth-page-subtitle error-message'>{error?.message ?  error.message : "Unknow error has occured."}</p>
            <button
            style={error ? style : {}}
                className="auth-page-p auth-page-btn"
                onClick={error?.action}
            >
            {error?.actionName}
            </button>
        </div>
        </div>
    )
}