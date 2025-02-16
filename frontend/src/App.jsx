import { Home } from "./pages/Home";
import { AuthPage } from "./pages/Auth";
import { ErrorPage } from "./pages/ErrorPage";
import { useAuthContext } from "./hooks/useAuthContext";

function App() {
  const { user } = useAuthContext();
  
  console.log("rendering app")
  return (
    // <ErrorPage />
    user ?  <Home /> : <AuthPage />
  );
}

export default App;
