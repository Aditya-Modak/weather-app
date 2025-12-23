import { useState } from "react";

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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;
