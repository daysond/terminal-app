
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {

    const {dispatch} = useAuthContext()

    const logout = () => {
        // TODO: LOCAL STORAGE
        // remove user from storage
        localStorage.removeItem('user')

        // dispatch logout action
        dispatch({type: "logged_out"})    
    }
    
    return {logout}
}