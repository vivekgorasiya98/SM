import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function TopStocks() {
  const [data, setData] = useState({ gainers: [], losers: [], market_open: false });
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/top-stocks/")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  const loadDetails = (symbol) => {
    setSelected(symbol);
    axios.get(`http://127.0.0.1:8000/api/stock-details/${symbol}/`)
      .then(res => setDetails(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Top Gainers & Losers</h1>

      <div className="flex gap-10">
        <div>
          <h2>Top Gainers</h2>
          <ul>
            {data.gainers.map((stock) => (
              <li key={stock.symbol} className="my-2">
                {stock.symbol} ({stock.change_percent}%)
                <button
                  className="ml-2 p-1 bg-blue-500 text-white rounded"
                  onClick={() => loadDetails(stock.symbol)}
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Top Losers</h2>
          <ul>
            {data.losers.map((stock) => (
              <li key={stock.symbol} className="my-2">
                {stock.symbol} ({stock.change_percent}%)
                <button
                  className="ml-2 p-1 bg-blue-500 text-white rounded"
                  onClick={() => loadDetails(stock.symbol)}
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {details && (
        <div className="mt-6 border p-4 rounded shadow">
          <h2 className="text-xl">{details.symbol} Details</h2>
          <p>Open: {details.open}</p>
          <p>Day High: {details.dayHigh}</p>
          <p>Day Low: {details.dayLow}</p>
          <p>Previous Close: {details.previousClose}</p>
          <p>Volume: {details.volume}</p>
          <p>Currency: {details.currency}</p>

          <h3 className="mt-4">Price History</h3>
          <LineChart width={600} height={300} data={details.history}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="time" hide />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
          </LineChart>
        </div>
      )}
    </div>
  );
}
