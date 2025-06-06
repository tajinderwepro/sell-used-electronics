import { AuthProvider } from "./context/AuthContext";
import AllRoutes from "./routes";

function App() {
  return (
    <AuthProvider>
        <AllRoutes/>
    </AuthProvider>
  );
}

export default App;
