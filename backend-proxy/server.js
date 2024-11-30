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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
