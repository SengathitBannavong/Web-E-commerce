import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./search_box.css";

export default function SearchBox({onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="search-box">
      <form className="search-form" onSubmit={handleSearch}>
        <FiSearch className="search-icon" />
        <input
          type="search"
          name="search"
          placeholder="Search for books, authors..."
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" aria-label="Search">
          <FiSearch />
        </button>
      </form>
      {onClose && (
        <button className="close-search-btn" onClick={onClose} aria-label="Close Search">
          ✕
        </button>
      )}
    </div>
  );
}
