import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:8000/users";
const headers = { Authorization: "Bearer valid_token" };

function App() {
  return (
    <div className="App">
      Welcome
    </div>
  );
}

export default App;
