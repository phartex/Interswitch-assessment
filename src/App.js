
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login.tsx';
import Register from './Components/Register.tsx';
import Flights from './Components/Flights.tsx';
import './App.css';

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={< Register/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/flights" element={<Flights />} />
      </Routes>
    </Router>
  );
}

export default App;
