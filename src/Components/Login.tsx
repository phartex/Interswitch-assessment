import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from '../shared/Nav.tsx';

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Basic email and password validation
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  

  const validatePassword = (password) => {
    return password.length >= 4;
  };

  const isFormValid = validateEmail(email) && validatePassword(password);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset error state
    setError('');

    // Validate the form fields
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://flight-management-proxy.onrender.com/api/login', {
        email,
        password,
      });

      // If login is successful and we receive a token
      if (response.data.id) {
        localStorage.setItem('authToken', response.data.token);
        toast.success('Login Successful!', {
          position: "top-right",
          autoClose: 5000,
        });

        setLoading(false);
        setTimeout(() => {
          navigate('/flights');
        }, 2000);
      } else {
        toast.error('Login Unsuccessful!', {
          position: "top-right",
          autoClose: 5000,
        });
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 py-4 px-10'>
  <Nav/>

      <div className="pt-6 flex flex-col items-center justify-center ">

    

        <form onSubmit={handleLogin} className="bg-white md:mt-16 p-6 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              maxLength={6}
              minLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#18425D] text-white py-2 px-4 rounded hover:bg-[#18425D] disabled:opacity-50"
          >
            {loading ? (
              <span className="loader animate-spin border-t-2 border-white border-solid rounded-full h-5 w-5 inline-block"></span>
            ) : (
              'Login'
            )}
          </button> */}

<button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full bg-[#18425D] text-white py-2 px-4 rounded hover:bg-[#18425D] disabled:opacity-50 ${
              !isFormValid || loading ? 'cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <span className="loader animate-spin border-t-2 border-white border-solid rounded-full h-5 w-5 inline-block"></span>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>

  )
}
