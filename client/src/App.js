import { useContext, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ModeProvider } from "./context/ModeContext";
import AllRoutes from "./routes";
import api from "./constants/api";
import SessionExpiredModal from "./components/common/SessionExpiredModal";
import { FilterProvider } from "./context/FilterContext";

function App() {
  const { user, getMe } = useAuth();

  useEffect(() => {
    getMe();
  }, []);

  return (
    <ModeProvider>
      <FilterProvider>
          <AllRoutes />
      </FilterProvider>
      <SessionExpiredModal/>
    </ModeProvider>
  );
}

export default App;
