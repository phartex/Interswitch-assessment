import { render, screen, fireEvent } from '@testing-library/react';
import React, { useState } from 'react';
import RegisterComponent from '../Components/Register'
import axios from 'axios';

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
