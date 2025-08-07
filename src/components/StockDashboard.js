import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StockDashboard({ backendURL }) {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState("nifty50");
  const navigate = useNavigate();

  const fetchData = (index) => {
    axios
      .get(`${backendURL}/api/top-stocks/?index=${index}`)
      .then((res) => {
        const gainersData = (res.data.gainers || [])
          .sort((a, b) => b.change_percent - a.change_percent)
          .slice(0, 4);

        const losersData = (res.data.losers || [])
          .sort((a, b) => a.change_percent - b.change_percent)
          .slice(0, 4);

        setGainers(gainersData);
        setLosers(losersData);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData(selectedIndex);
  }, [selectedIndex]);

  const renderCard = (stock, isGainer) => (
    <div key={stock.symbol} className="col-6 mb-4">
      <div className="card shadow-sm h-100">
        <div className="card-body text-center">
          <h5 className="card-title fw-bold">{stock.symbol}</h5>
          <p className="card-text text-muted mb-1">
            Open: {stock.open} | Close: {stock.close}
          </p>
          <p className={`fw-bold ${isGainer ? "text-success" : "text-danger"}`}>
            {stock.change_percent > 0 ? "+" : ""}
            {stock.change_percent.toFixed(2)}%
          </p>
          <button
            className={`btn ${isGainer ? "btn-success" : "btn-danger"} mt-2`}
            onClick={() => navigate(`/stocks/${stock.symbol}`)}
          >
            View Graph
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 fw-bold">Top Gainers & Losers</h1>

      {/* Index Selection Dropdown */}
      <div className="mb-4 text-center">
        <select
          className="form-select w-auto d-inline-block"
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(e.target.value)}
        >
          <option value="nifty50">Nifty 50</option>
          <option value="banknifty">Bank Nifty</option>
          <option value="nifty500">Nifty 500</option>
          <option value="nifty100">Nifty 100</option>
          <option value="nifty200">Nifty 200</option>
        </select>
      </div>

      <div className="row">
        {/* Gainers */}
        <div className="col-md-6 mb-4">
          <h3 className="text-success mb-3">🔼 Top Gainers</h3>
          <div className="row">
            {gainers.length > 0
              ? gainers.map((stock) => renderCard(stock, true))
              : <p className="text-muted">No gainers available.</p>}
          </div>
        </div>

        {/* Losers */}
        <div className="col-md-6 mb-4">
          <h3 className="text-danger mb-3">🔽 Top Losers</h3>
          <div className="row">
            {losers.length > 0
              ? losers.map((stock) => renderCard(stock, false))
              : <p className="text-muted">No losers available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
