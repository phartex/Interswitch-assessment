// src/components/FlightForm.test.js

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateFlight from '../Components/CreateFlight';

jest.mock('axios'); 

describe('FlightForm', () => {
  it('should submit the form and create a flight', async () => {
    const mockPost = jest.fn().mockResolvedValue({
      data: { id: '123', code: 'abcd', capacity: 30, departureDate: '2024-12-16' }
    });
    axios.post = mockPost;

    render(<CreateFlight />); // Render your form component

    const submitButton = screen.getByText(/submit/i);
    const capacityInput = screen.getByLabelText(/capacity/i);

    fireEvent.change(capacityInput, { target: { value: '30' } }); // Set input value
    fireEvent.click(submitButton); // Simulate form submission

    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1)); // Ensure the mock was called

    expect(mockPost).toHaveBeenCalledWith(
      "https://flight-management-proxy.onrender.com/api/create-flight",
      expect.objectContaining({
        capacity: 30, // Ensure capacity is correctly converted to number
      })
    );
  });
});
