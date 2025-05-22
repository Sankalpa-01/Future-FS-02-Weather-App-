import React, { useEffect, useState } from 'react';
import WeatherBackground from './components/WeatherBackground';
import { HumidityIcon, SunriseIcon, SunsetIcon, VisibilityIcon, WindIcon } from './components/Icons';
import FavoriteCities from './components/FavoriteCities';
import { useFavorites } from './components/FavoritesContext';

const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [suggestion, setSuggestion] = useState([]);
  const [unit, setUnit] = useState('C');
  const [error, setError] = useState('');
  const { favorites, addFavorite, removeFavorite} = useFavorites();

  // Helpers
  const convertTemperature = (temp, unit) =>
    unit === 'C' ? temp.toFixed(1) : ((temp * 9) / 5 + 32).toFixed(1);

  const getHumidityValue = (humidity) =>
    humidity > 70 ? 'High' : humidity < 40 ? 'Low' : 'Moderate';

  const getWindSpeed = (speed) =>
    speed > 10 ? 'Strong' : speed < 3 ? 'Calm' : 'Breezy';

  const getVs = (vis) =>
    vis > 10000 ? 'Excellent' : vis > 5000 ? 'Good' : 'Poor';

  const fetchSuggestion = async (query) => {
    try {
      const res = await fetch(`https://weather-app-backend-q8lz.onrender.com/api/weather/suggest?q=${query}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestion(data);
      } else {
        setSuggestion([]);
      }
    } catch {
      setSuggestion([]);
    }
  };

  useEffect(() => {
    if (city.trim().length >= 3) {
      const timer = setTimeout(() => {
        fetchSuggestion(city);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setSuggestion([]);
    }
  }, [city]);

  const fetchWeatherData = async (url, name = '') => {
    setError('');
    setWeather(null);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'City not found');
      }
      const data = await res.json();
      setWeather(data);
      setCity(name || data.name);
      setSuggestion([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) {
      return setError('Please enter a valid city name');
    }
    await fetchWeatherData(`https://weather-app-backend-q8lz.onrender.com/api/weather/city?q=${city.trim()}`);
  };

  const getWeatherCondition = () =>
    weather && {
      main: weather.weather[0].main,
      isDay:
        Date.now() / 1000 > weather.sys.sunrise &&
        Date.now() / 1000 < weather.sys.sunset,
    };

  const handleFavoriteCityClick = (selectedCity) => {
    fetchWeatherData(`https://weather-app-backend-q8lz.onrender.com/api/weather/city?q=${selectedCity}`, selectedCity);
  };

  const handleAddToFavorites = () => {
    if (city && !favorites.includes(city)) {
      addFavorite(city);
    }
  };

  return (
    <div className="min-h-screen">
      <WeatherBackground condition={getWeatherCondition()} />

      <div className="flex items-center justify-center p-6 min-h-screen">
        <div className="bg-transparent backdrop-filter backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-md text-white w-full border border-white/40 relative z-10">
          <h1 className="text-4xl font-extrabold text-center mb-6">Weather App</h1>

          <FavoriteCities onCitySelect={handleFavoriteCityClick} />

          {!weather ? (
            <form onSubmit={handleSearch} className="flex flex-col relative mt-4">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter City or Country (min 3 letters)"
                className="mb-4 p-3 rounded border border-white bg-transparent text-white placeholder-white focus:outline-none focus:border-blue-400 transition duration-300"
              />
              {suggestion.length > 0 && (
                <div className="absolute top-14 left-0 right-0 bg-white bg-opacity-10 backdrop-blur-md rounded shadow-md z-20">
                  {suggestion.map((s) => (
                    <button
                      type="button"
                      key={`${s.lat}-${s.lon}`}
                      onClick={() =>
                        fetchWeatherData(
                          `https://weather-app-backend-q8lz.onrender.com/api/weather/coords?lat=${s.lat}&lon=${s.lon}`,
                          `${s.name}, ${s.country}${s.state ? `, ${s.state}` : ''}`
                        )
                      }
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-700 bg-transparent text-white"
                    >
                      {s.name}, {s.country}
                      {s.state ? `, ${s.state}` : ''}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="submit"
                className="bg-purple-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Get Weather
              </button>
            </form>
          ) : (
            <div className="mt-6 text-center transition-opacity duration-500">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => {
                    setWeather(null);
                    setCity('');
                  }}
                  className="bg-purple-900 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded transition-colors"
                >
                  New Search
                </button>
                <button
                  onClick={handleAddToFavorites}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-1 px-3 rounded transition-colors"
                >
                  + Add to Favorites
                </button>
              </div>

              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">{weather.name}</h2>
                <button
                  onClick={() => setUnit((u) => (u === 'C' ? 'F' : 'C'))}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-1 px-3 rounded transition-colors"
                >
                  &deg;{unit}
                </button>
              </div>

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="mx-auto my-4 animate-bounce"
              />
              <p className="text-4xl">
                {convertTemperature(weather.main.temp, unit)} &deg;{unit}
              </p>
              <p className="capitalize">{weather.weather[0].description}</p>

              <div className="flex flex-wrap justify-around mt-6">
                {[
                  [HumidityIcon, 'Humidity', `${weather.main.humidity}% (${getHumidityValue(weather.main.humidity)})`],
                  [WindIcon, 'Wind', `${weather.wind.speed} m/s (${getWindSpeed(weather.wind.speed)})`],
                  [VisibilityIcon, 'Visibility', getVs(weather.visibility)],
                ].map(([Icon, label, value]) => (
                  <div key={label} className="flex flex-col items-center m-2">
                    <Icon />
                    <p className="mt-1 font-semibold">{label}</p>
                    <p className="text-sm text-center">{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-around mt-6">
                {[
                  [SunriseIcon, 'Sunrise', weather.sys.sunrise],
                  [SunsetIcon, 'Sunset', weather.sys.sunset],
                ].map(([Icon, label, time]) => (
                  <div key={label} className="flex flex-col items-center m-2">
                    <Icon />
                    <p className="mt-1 font-semibold">{label}</p>
                    <p className="text-sm">
                      {new Date(time * 1000).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-sm">
                <p>
                  <strong>Feels like: </strong>
                  {convertTemperature(weather.main.feels_like, unit)} &deg;{unit}
                </p>
                <p>
                  <strong>Pressure: </strong>
                  {weather.main.pressure} hPa
                </p>
              </div>
            </div>
          )}

          {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default App;