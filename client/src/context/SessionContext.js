import { createContext, useContext, useEffect, useState } from 'react';

export const SessionContext = createContext();

let externalSetOpen = null;

export const SessionProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    externalSetOpen = setOpen;
  }, []);

  return (
    <SessionContext.Provider value={{ open, setOpen }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);

export const triggerSessionModal = () => {
  if (externalSetOpen) {
    externalSetOpen(true);
  }
};
