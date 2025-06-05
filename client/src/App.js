import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:8000/api/v1/users";
const headers = { Authorization: "Bearer valid_token" };

function App() {

  useEffect(()=>{
      axios.get(API_URL,{headers}).then((res)=> console.log(res));
  },[])
  return (
    <div className="App">
      Welcome
    </div>
  );
}

export default App;
