import React, { useEffect, useState } from 'react';

function FavoriteCountries({ username }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const user = users[username];
    if (user) {
      setFavorites(user.favorites || []);
    }
  }, [username]);

  const toggleFavorite = (country) => {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const user = users[username];
    if (!user) return;

    if (user.favorites.includes(country)) {
      user.favorites = user.favorites.filter((fav) => fav !== country);
    } else {
      user.favorites.push(country);
    }

    users[username] = user;
    localStorage.setItem('users', JSON.stringify(users));
    setFavorites(user.favorites);
  };

  return (
    <div>
      <h2>Favorite Countries</h2>
      <ul>
        {favorites.map((country) => (
          <li key={country}>
            {country}{' '}
            <button onClick={() => toggleFavorite(country)}>
              {favorites.includes(country) ? '★' : '☆'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FavoriteCountries;
