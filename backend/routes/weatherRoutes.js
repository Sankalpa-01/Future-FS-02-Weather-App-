import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Make sure this is here to load .env variables

const router = express.Router();
const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
  console.warn('⚠️ Warning: OPENWEATHER_API_KEY is not set in .env');
}

// GET /api/weather/city?q=CityName
router.get('/city', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'City is required' });

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Failed to fetch weather data by city',
    });
  }
});

// GET /api/weather/coords?lat=...&lon=...
router.get('/coords', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'Latitude and longitude are required' });

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Failed to fetch weather data by coordinates',
    });
  }
});

// GET /api/weather/suggest?q=partialCityName
router.get('/suggest', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'City query is required for suggestions' });

  try {
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Failed to fetch city suggestions',
    });
  }
});

export default router;
