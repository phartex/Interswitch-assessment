import React, { useState } from 'react'
import Nav from '../shared/Nav.tsx'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function CreateFlight() {
    interface FormData {
        code: string;
        capacity: number;
        departureDate: string;
    }

    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        code: "",
        capacity: 0,
        departureDate: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const createFlight = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const newCapacity = Number(formData.capacity)
        formData.capacity = newCapacity;
        console.log(formData)
        try {
            const response = await axios.post("https://flight-management-proxy.onrender.com/api/create-flight", formData);
            console.log("Flight Created:", response.data);
            toast.success('Registration Successful!', {
                position: "top-right",
                autoClose: 5000,
            });
            navigate('/flights')
        } catch (err) {
            console.error("Error creating flight:", err);
            toast.error(err.response.data.message, {
                position: "top-right",
                autoClose: 5000,
            });
            // setError("Failed to create flight. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className='py-4 px-10 bg-gray-100 md:min-h-screen'>
            <Nav />

            <div className="pt-6 flex flex-col items-center justify-center">
                <form onSubmit={createFlight} className="bg-white p-6 rounded shadow-md w-full max-w-sm md:mt-8">
                    <h2 className="text-2xl font-semibold text-center mb-6">Create Flight</h2>
                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                    <div className="mb-4">
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                            Flight Code
                        </label>
                        <input
                            type="text"
                            id="code"
                            name="code"
                            minLength={6}
                            maxLength={6}
                            value={formData.code}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                            Capacity
                        </label>
                        <input
                            type="number"
                            id="capacity"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700">
                            Departure Date
                        </label>
                        <input
                            type="date"
                            id="departureDate"
                            name="departureDate"
                            value={formData.departureDate}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#18425D] text-white mt-2 py-2 px-4 rounded hover:bg-[#18425D] disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="loader animate-spin border-t-2 border-white border-solid rounded-full h-5 w-5 inline-block"></span>
                        ) : (
                            "Create Flight"
                        )}
                    </button>
                </form>
                <ToastContainer />
            </div>

        </div>
    )
}
