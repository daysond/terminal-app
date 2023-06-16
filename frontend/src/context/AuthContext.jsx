import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'logged_in':
            return {user: action.payload}
        
        case 'logged_out':
            return {user: null}
        
        // case 'signed_up':
        //     return {user: null}
    
        default:
            return state
    }
}

export const AuthContextProvider = ({children}) => {
    console.log("provider auth context")
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })

    useEffect(()=> {
        // check localstorage for token
        // TODO: LOCAL STORAGE
        const user = JSON.parse(localStorage.getItem('user'))

        if (user) {
            console.log(user)
            dispatch({type: 'logged_in', payload: user})
        }

    }, [])

    console.log("AuthContext state: ", state)

    return (
        <AuthContext.Provider value={ {...state, dispatch} }>
            {children}
        </AuthContext.Provider>
    )
}