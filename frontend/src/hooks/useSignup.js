
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()

    const signup = async (email, password, confirm) => {
        
        if(password !== confirm) {
            setError("Please make sure your passwords match.")
            return {signup, isLoading, error}
        }
        
        setIsLoading(true)
        setError(null)

        // const response = await fetch('/api/user/signup', {
        //     method: 'POST',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({email, password})
        // })

        // const json = await response.json()

        // if(!response.ok) {
        //     setIsLoading(false)
        //     setError(json.error)
        
        // } else {
            
        //     // save the user to local storage 
        //     // TODO: Change it to redis ??
        //     localStorage.setItem('user', JSON.stringify(json))
            
        //     // update auth context
        //     dispatch({type:"logged_in", payload: json})

        //     setIsLoading(false)
        // }
    }

    return {signup, isLoading, error}
}