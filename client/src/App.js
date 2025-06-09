import { AuthProvider } from "./context/AuthContext";
import { ModeProvider } from "./context/ModeContext";
import AllRoutes from "./routes";

function App() {
  return (
    <AuthProvider>
      <ModeProvider>
         <AllRoutes/>
      </ModeProvider>
    </AuthProvider>
  );
}

export default App;
