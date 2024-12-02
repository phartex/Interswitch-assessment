import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import InterswitchImage from "../image/interswitch_logo.svg";
import 'react-toastify/dist/ReactToastify.css';


// Define types for form data and error
interface FormData {
  name: string;
  email: string;
  password: string;
}



const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Basic input validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      console.log(response);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        toast.success('Registration Successful!', {
          position: "top-right",
          autoClose: 5000,
        });
        setLoading(false);
        // navigate('/login');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error('Registration Unsuccessful!', {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }

  };

  return (
    <div className='bg-gray-100 md:min-h-screen'>
      <div className='p-4'>
        {/* <img src={InterswitchImage} alt="Interswitch Logo" /> */}
      </div>

      <div className="pt-6 flex flex-col items-center justify-center">

        <p className='pt-3 px-5 text-2xl md:pt-0 font-bold'>Flight Management System</p>
        <h1 className="text-2xl mt-6  mb-4">Register</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#18425D] text-white py-2 px-4 rounded hover:bg-[#18425D] disabled:opacity-50"
          >
            {loading ? (
              <span className="loader animate-spin border-t-2 border-white border-solid rounded-full h-5 w-5 inline-block"></span>
            ) : (
              'Register'
            )}
          </button>

        </form>

        <ToastContainer />
      </div>
    </div>

  );
};

export default Register;
