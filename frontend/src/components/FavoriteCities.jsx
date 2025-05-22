// src/components/FavoriteCities.jsx
import React from 'react';
import { useFavorites } from './FavoritesContext'; // ✅ correct import path

const FavoriteCities = ({ onCitySelect }) => {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">⭐ Favorite Cities</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorites saved.</p>
      ) : (
        <ul className="list-none text-lg">
          {favorites.map((city) => (
            <li key={city} className="flex justify-between items-center mb-2">
              <button
                onClick={() => onCitySelect(city)}
                className="text-white hover:underline"
              >
                ✔ {city}
              </button>
              <button
                onClick={() => removeFavorite(city)}
                className="ml-4 text-red-400 hover:text-red-600"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoriteCities;
