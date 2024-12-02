
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login.tsx';
import Register from './Components/Register.tsx';
import Flights from './Components/Flights.tsx';
import './App.css';
import CreateFlight from './Components/CreateFlight.tsx';

function App() {
  return (    
    <Router>
      <Routes>
        <Route path="/" element={< Register/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/create-flight" element={<CreateFlight />} />
      </Routes>
    </Router>
  );
}

export default App;
