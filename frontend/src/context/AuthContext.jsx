import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "logged_in":
      return { user: action.payload };

    case "logged_out":
      return { user: null };
    case "updated":
      return { user: action.payload };
    // case 'signed_up':
    //     return {user: null}

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  console.log("provider auth context");
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    // check localstorage for token
    // TODO: LOCAL STORAGE
    const user = JSON.parse(localStorage.getItem("user"));

    const verifyUser = async () => {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user?.token}`,
        },
      };

      const response = await fetch(
        "http://localhost:4000/api/user/verify_token",
        requestOptions
      );

      if (response.ok) {
        dispatch({ type: "logged_in", payload: user });
      } else {
        const json = await response.json();
        console.log(json.status, json.message);
        dispatch({ type: "logged_out", payload: null });
      }
    };

    if (user) {
      console.log(user);
      verifyUser();
    }
  }, []);

  console.log("AuthContext state: ", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
