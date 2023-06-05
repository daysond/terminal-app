import { Home } from "./pages/Home"
import { Auth } from "./pages/Auth"
import { useAuthContext } from "./hooks/useAuthContext"


function App() {

  const {user} = useAuthContext()

  console.log("init app, ", user?.email)

  return(
    user ?  <Home /> : <Auth />
  )


}

export default App
