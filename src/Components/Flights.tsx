import React, { useState, useEffect } from "react";
import axios from "axios";
import InterswitchImage from "../image/interswitch_logo.svg";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Flights() {
  const [flights, setFlights] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [flightsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [totalPages, setTotalPages] = useState(0);


  useEffect(() => {
   
    fetchFlights();
  }, [currentPage,flightsPerPage]);



  const fetchFlights = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/flights", {
        params: { page: currentPage, size: flightsPerPage }, // Pass currentPage and size
      });
      console.log(response.data); // Debugging purpose
      setFlights(response.data.resources); // Adjust according to your API response
      setTotalPages(response.data.counts); 

    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  const filteredFlights = flights.filter((flight: any) =>
    flight.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (flight: any) => {
    setSelectedFlight(flight);
    setIsModalOpen(true);
  };


  const handleDeleteClick = async (flight)=>{
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
    const payload ={      
        code: selectedFlight.code,
        capacity: selectedFlight.capacity,
        departureDate: selectedFlight.departureDate  
    }
    console.log(payload)
    try {
      const response = await axios.put(
        `http://localhost:5000/api/flights/${selectedFlight.id}`,
        payload
      );
      console.log(response.data);
      toast.success('Update Successful!', {
        position: "top-right",
        autoClose: 5000,
      });
      // Update flights state
      setFlights((prev : any) =>
        prev.map((flight:any) =>
          flight.id === selectedFlight.id ? response.data : flight
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
    <div className="p-4 bg-gray-100 min-h-screen">
      <div>
        {/* <img src={InterswitchImage} alt="Interswitch Logo" /> */}
      </div>

      <h1 className="text-2xl font-bold mb-4 text-center pt-5">Flight Management</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by flight code"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      />

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
                  <td className="px-4 py-2">{flight.status}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button onClick={() => handleEditClick(flight)} className="bg-[#18425D] text-white px-3 py-1 rounded hover:bg-[#18425D]">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteClick(flight)}  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      Delete
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
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
