import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from "react-toastify";
import { AuthProvider } from './context/AuthContext';
import { SessionProvider } from './context/SessionContext';
import { QuoteFormProvider } from './context/QuoteFormContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SessionProvider>
      <AuthProvider>
         <QuoteFormProvider>
          <ToastContainer/>
           <App />
         </QuoteFormProvider>
      </AuthProvider>
    </SessionProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
