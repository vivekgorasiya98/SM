import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHome, FaPlusSquare, FaSignOutAlt ,FaChartLine} from "react-icons/fa";
import "./Topbar.css";

export default function Topbar({ u_token,backendURL, onLogout }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);

  // 🔹 Debounced Search
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      axios
        .get(`${backendURL}/api/stocks/search/?q=${value}`)
        .then((res) => setResults(res.data))
        .catch(() => setResults([]));
    }, 500);
  };

  const handleSelect = (symbol) => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    navigate(`/stocks/${symbol}`);
  };

  return (
    <div className="topbar">
      {/* Logo */}
      <div className="logo">
        <img src="/images/logo1.png" style={{ height: "40px" }} alt="Logo" />
      </div>

      {/* Search Field */}
      <div className="relative w-64">
        <input
          type="text"
          value={query}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          onChange={handleChange}
          placeholder="Search stocks..."
          className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Dropdown Results */}
        {showDropdown && query && (
          <div className="absolute top-full left-0 w-full bg-white border rounded shadow-lg mt-1 max-h-60 overflow-y-auto z-50">
            {results.length > 0 ? (
              results.map((stock) => (
                <div
                  key={stock.symbol}
                  onClick={() => handleSelect(stock.symbol)}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  {stock.symbol}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No results found...</div>
            )}
          </div>
        )}
      </div>

      {/* Right Menu Items */}
      <div className="topbar-items">
        <NavLink to="/home" className="topbar-item">
          <FaHome className="topbar-icon" />
          <span className="topbar-text">Home</span>
        </NavLink>

        {u_token === "eaa0f5c8-2b83-4175-8da0-15cd95c15b88" && (
          <NavLink to="/create" className="topbar-item">
            <FaPlusSquare className="topbar-icon" />
            <span className="topbar-text">Create</span>
          </NavLink>
        )}

        <NavLink to="/indices" className="topbar-item">
          <FaChartLine className="topbar-icon" />

          <span className="topbar-text">Indices</span>
        </NavLink>

        {/* Logout Button */}
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to log out?")) {
              onLogout(); // Call logout only if confirmed
            }
          }}
          className="topbar-item flex items-center px-3 py-2 text-red-500 hover:text-red-700"
          style={{ background: "transparent", border: "none", cursor: "pointer" }}
        >
          <FaSignOutAlt className="topbar-icon" />
          <span className="topbar-text">Logout</span>
        </button>

      </div>
    </div>
  );
}
