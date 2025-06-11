import { useContext, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ModeProvider } from "./context/ModeContext";
import AllRoutes from "./routes";
import api from "./constants/api";
import SessionExpiredModal from "./components/common/SessionExpiredModal";

function App() {
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      getMe();
    }
  }, [user]);

  const getMe = async () => {
    try {
      await api.auth.me();
    } catch (error) {}
  };
  return (
    <ModeProvider>
      <AllRoutes />
      <SessionExpiredModal/>
    </ModeProvider>
  );
}

export default App;
