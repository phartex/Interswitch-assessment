import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Nav from "../shared/Nav.tsx";
import { FaSearch } from 'react-icons/fa';

export default function Flights() {
  const [flights, setFlights] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [flightsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  interface Flight {
    id: string;
    img: string;
    status: string;
    code: string;
    capacity: number;
    departureDate: string;
  }

  useEffect(() => {

    fetchFlights();
  }, [currentPage, flightsPerPage]);



  const fetchFlights = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://flight-management-proxy.onrender.com/api/flights", {
        params: { page: currentPage, size: flightsPerPage }, // Pass currentPage and size
      });
      console.log(response.data); // Debugging purpose
      setFlights(response.data.resources); // Adjust according to your API response
      setTotalPages(response.data.counts);

    } catch (error) {
      console.error("Error fetching flights:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFlights = flights.filter((flight: any) =>
    flight.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (flight: any) => {
    console.log(flight)
    setSelectedFlight(flight);
    setIsModalOpen(true);
  };


  const handleDeleteClick = async (flight) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/flights/${flight.id}`);
      console.log(response.data);
      fetchFlights();
      toast.success('Deleted Successfully!', {
        position: "top-right",
        autoClose: 5000,
      });
    } catch (error) {
      console.error("Error fetching flights:", error);
      toast.error('Could not delete, please try again', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }


  // const handlePrevPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage((prevPage) => prevPage - 1);
  //   }
  // };

  const handleNextPage = () => {
    // if (currentPage < totalPages) {
    //   setCurrentPage((prevPage) => prevPage + 1);
    // }
    console.log(currentPage)
    setCurrentPage((prevPage) => {
      const nextPage = prevPage + 1;
      console.log(nextPage); // Shows the updated value after the increment
      return nextPage;
    });
  };

  const handleUpdateFlight = async () => {
    console.log(selectedFlight)
    const payload = {
      code: selectedFlight?.code,
      capacity: selectedFlight?.capacity,
      departureDate: selectedFlight?.departureDate
    }
    console.log(payload)
    try {
      const response = await axios.put(
        `http://localhost:5000/api/flights/${selectedFlight?.id}`,
        payload
      );
      console.log(response.data);
      toast.success('Update Successful!', {
        position: "top-right",
        autoClose: 5000,
      });
      // Update flights state
      setFlights((prev: any) =>
        prev.map((flight: any) =>
          flight.id === selectedFlight?.id ? response.data : flight
        )
      );
      setIsModalOpen(false); // Close modal
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Error updating flight:", error);
    }
  };



  return (
    <div className="py-4 px-3 md:px-10 bg-gray-100 min-h-screen">
      <Nav />

      <div className="flex justify-between mt-3">
        <div></div>
        <div className="py-4">
          <button
            onClick={() => navigate('/create-flight')}
            className="px-4 py-2 rounded bg-[#18425D] text-white hover:bg-white hover:text-[#18425D] font-medium"
          >
            Create Flight
          </button>
        </div>
      </div>

      {/* Search */}
      {/* <input
        type="text"
        placeholder="Search by flight code"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      /> */}


      <div className="flex items-center border border-gray-300 rounded p-2 w-full my-5 bg-white">
        <FaSearch className="text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by flight code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none px-2 text-gray-700 bg-white"
        />
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto ">
        <table className="w-full table-auto bg-white rounded shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Flight Code</th>
              <th className="px-4 py-2 text-left">Capacity</th>
              <th className="px-4 py-2 text-left">Departure Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFlights.length > 0 ? (
              filteredFlights.map((flight: any) => (
                <tr key={flight.id} className="border-b">
                  <td className="px-4 py-2">{flight.code}</td>
                  <td className="px-4 py-2">{flight.capacity}</td>
                  <td className="px-4 py-2">{flight.departureDate}</td>
                  <td className="px-4 py-2 ">{flight.status}</td>
                  <td className="px-4 py-2 text-center flex justify-evenly">
                    <button onClick={() => handleEditClick(flight)} className="bg-[#18425D] text-white px-3 py-1 rounded hover:bg-[#18425D]">
                      Edit
                    </button>
                    {/* <button onClick={() => handleDeleteClick(flight)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      Delete
                    </button> */}


                    <button
                      type="submit"
                      onClick={() => handleDeleteClick(flight)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2"
                    >
                      {loading ? (
                        <span className="loader animate-spin border-t-2 border-white border-solid rounded-full h-5 w-5 inline-block"></span>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No flights found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center items-center space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${currentPage === 1
            ? "bg-gray-300"
            : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
        >
          Previous
        </button>
        <span className="px-4">{currentPage}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}

          className="px-4 py-2 rounded bg-[#18425D] text-white hover:bg-[#18425D]"
        >
          Next
        </button>
      </div>



      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Edit Flight</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateFlight();
              }}
            >
              {/* Flight Code */}
              <div className="mb-4">
                <label className="block mb-2">Flight Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={selectedFlight?.code || ""}
                  onChange={(e) =>
                    setSelectedFlight({ ...selectedFlight, code: e.target.value })
                  }
                  className="border p-2 w-full rounded"
                />
              </div>

              {/* Capacity */}
              <div className="mb-4">
                <label className="block mb-2">Capacity</label>
                <input
                  type="number"
                  value={selectedFlight?.capacity || ""}
                  onChange={(e) =>
                    setSelectedFlight({ ...selectedFlight, capacity: e.target.value })
                  }
                  className="border p-2 w-full rounded"
                />
              </div>

              {/* Status */}
              <div className="mb-4">
                <label className="block mb-2">Status</label>
                <select
                  value={selectedFlight?.status || ""}
                  onChange={(e) =>
                    setSelectedFlight({ ...selectedFlight, status: e.target.value })
                  }
                  className="border p-2 w-full rounded"
                >
                  <option value="none">None</option>
                  <option value="on-time">On Time</option>
                  <option value="delayed">Delayed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Departure Date */}
              <div className="mb-4">
                <label className="block mb-2">Departure Date</label>
                <input
                  type="date"
                  value={selectedFlight?.departureDate || ""}
                  onChange={(e) =>
                    setSelectedFlight({ ...selectedFlight, departureDate: e.target.value })
                  }
                  className="border p-2 w-full rounded"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#18425D] text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}





      <ToastContainer />
    </div>
  );
}
