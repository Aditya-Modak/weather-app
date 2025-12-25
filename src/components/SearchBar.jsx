import React, { useState } from "react";
import "./SearchBar.css";


function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (city.trim() === "") {
      alert("Please enter a city name");
      return;
    }

    onSearch(city);
    setCity("");
  }

  return (
    <form onSubmit={handleSubmit} className="search-form">
  <input
    className="search-input"
    type="text"
    placeholder="Enter city name"
    value={city}
    onChange={(e) => setCity(e.target.value)}
  />
  <button className="search-btn" type="submit">Search</button>
</form>

  );
}

export default SearchBar;
