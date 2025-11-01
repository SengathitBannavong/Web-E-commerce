import { useState } from "react";
import "./search_box.css";

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchTerm);
  };

  return (
    <form className="search-form" onSubmit={handleSearch}>
      <input
        type="search"
        name="search"
        placeholder="Search for books, authors..."
        aria-label="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
