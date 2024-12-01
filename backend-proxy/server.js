const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/register', async (req, res) => {
  console.log('Received request with data:', req.body); // Log the incoming request body

  try {
    const response = await axios.post(
      'https://flight-api-rdtr.onrender.com/auth/register',
      req.body
    );

    console.log('Received response from flight API:', response.data); // Log the response from the external API
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in API request:', error); // Log the error
    // Check if there's a response from the external API
    if (error.response) {
      console.log('Error response from flight API:', error.response.data);
      res.status(error.response.status).json(error.response.data); // Forward the error response
    } else {
      // If there's no response from the external API (e.g., network error)
      res.status(500).json({ message: 'Error making request to the flight API' });
    }
  }
});

app.post('/api/login', async (req, res) => {
  console.log('Received request with data:', req.body); // Log the incoming request body

  try {
    const response = await axios.post(
      'https://flight-api-rdtr.onrender.com/auth/login',
      req.body
    );

    console.log('Received response from flight API:', response.data); // Log the response from the external API
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in API request:', error); // Log the error
    // Check if there's a response from the external API
    if (error.response) {
      console.log('Error response from flight API:', error.response.data);
      res.status(error.response.status).json(error.response.data); // Forward the error response
    } else {
      // If there's no response from the external API (e.g., network error)
      res.status(500).json({ message: 'Error making request to the flight API' });
    }
  }
});

app.get('/api/flights', async (req, res) => {
  const { page, size } = req.query; // Get page and size from query params

  try {
    const response = await axios.get(`https://flight-api-rdtr.onrender.com/flights`, {
      params: { page, size },
    });

    res.json(response.data); // Return the API response
  } catch (error) {
    console.error('Error fetching flight data:', error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data || 'An error occurred',
    });
  }
});

app.put('/api/flights/:id', async (req, res) => {
  const { id } = req.params; // Extract the flight ID from the URL
  const { code, capacity, departureDate } = req.body; // Extract payload from the request body

  // Validate required fields
  if (!code || !capacity || !departureDate) {
    return res.status(400).json({ message: 'Missing required fields' });
  } else if (/\d/.test(code)) {
    return res.status(400).json({ message: 'code conatains numbers' });
  }
  try {
    // Forward the PUT request to the external API
    const response = await axios.put(`https://flight-api-rdtr.onrender.com/flights/${id}`, {
      code,
      capacity,
      departureDate,
    });

    // Respond with the external API's response
    res.json(response.data);
  } catch (error) {
    console.error('Error updating flight:', error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data || 'An error occurred',
    });
  }
});



app.delete('/api/flights/:id', async (req, res) => {
  const { id } = req.params;
console.log(id)
  try {
    const response = await axios.delete(`https://flight-api-rdtr.onrender.com/flights/${id}`);
    res.json(response.data); // Pass the API's response back
  } catch (error) {
    console.error('Error deleting flight:', error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data || 'An error occurred',
    });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
