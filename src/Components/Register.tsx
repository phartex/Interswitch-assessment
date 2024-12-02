import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from '../shared/Nav.tsx';


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

  const isFormValid = formData.name && formData.email && formData.password.length >= 4 && formData.password.length <= 6;


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
      const response = await axios.post('https://flight-management-proxy.onrender.com/api/register', formData);
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
    <div className='py-4 px-10 bg-gray-100 min-h-screen p-4'>
      <Nav />
      <div className="pt-6 flex flex-col items-center justify-center">


        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm md:mt-8">
          <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
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
              minLength={4}
              maxLength={6}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
         

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full bg-[#18425D] text-white py-2 px-4 rounded hover:bg-[#18425D] disabled:opacity-50 ${!isFormValid || loading ? 'cursor-not-allowed' : ''
              }`}
          >
            {loading ? (
              <span className="loader animate-spin border-t-2 border-white border-solid rounded-full h-5 w-5 inline-block"></span>
            ) : (
              'Register'
            )}
          </button>

          <p className='py-3 text-right '>Already registered? <a onClick={() => navigate('/login')} className='font-medium text-[#18425D] underline underline-offset-8 cursor-pointer'>please login</a></p>

        </form>

        <ToastContainer />
      </div>
    </div>

  );
};

export default Register;
