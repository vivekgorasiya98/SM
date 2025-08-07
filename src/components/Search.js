import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StockSearch({ backendURL }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      axios
        .get(`${backendURL}/api/stocks/search/?q=${query}`)
        .then((res) => setResults(res.data))
        .catch((err) => console.error(err));
    }, 500); // 0.5s debounce

    return () => clearTimeout(delayDebounce);
  }, [query, backendURL]);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Search Stocks</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type stock name or symbol..."
        className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="mt-4 space-y-2">
        {results.length > 0 ? (
          results.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => navigate(`/stocks/${stock.symbol}`)}
              className="block w-full text-left px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded"
            >
              {stock.symbol}
            </button>
          ))
        ) : query ? (
          <p className="text-gray-500">No results found...</p>
        ) : null}
      </div>
    </div>
  );
}
