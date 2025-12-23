import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./search_box.css";

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchTerm.trim())}`);
    }
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
