import { render, screen, fireEvent } from '@testing-library/react';
import React, { useState } from 'react';
import RegisterComponent from '../Components/Register';
import FlightsComponent from '../Components/Flights'
import CreateFlightComponent from '../Components/CreateFlight.tsx'
import axios from 'axios';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Login from '../Components/Login.tsx';

jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));


// const mockedAxios = axios as jest.Mocked<typeof axios>;


const SearchInput = () => {
  const [search, setSearch] = useState('');
  return (
    <input
      type="text"
      placeholder="Search by flight code"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border p-2 rounded mb-4 w-full"
    />
  );
};



describe('SearchInput', () => {
  it('renders the input field', () => {
    render(<SearchInput />);
    const input = screen.getByPlaceholderText(/Search by flight code/i);
    expect(input).toBeInTheDocument();
  });

  it('updates the value on change', () => {
    render(<SearchInput />);
    const input = screen.getByPlaceholderText(/Search by flight code/i);

    // Simulate typing into the input
    fireEvent.change(input, { target: { value: 'Flight123' } });

    // Verify the value updates
    expect(input.value).toBe('Flight123');
  });
});

