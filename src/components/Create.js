import React, { useState } from "react";

export default function Create({ u_token,backendURL }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadStocks = async () => {
    setLoading(true);
    setLogs(["Loading stocks..."]);

    try {
      const res = await fetch(`${backendURL}/load-stocks/`);
      const data = await res.json();

      if (data.status === "success") {
        for (let i = 0; i < data.logs.length; i++) {
          setLogs((prev) => [...prev, data.logs[i]]);
        }
      } else {
        setLogs((prev) => [...prev, data.message || "Something went wrong"]);
      }
    } catch (err) {
      setLogs((prev) => [...prev, "Error loading stocks"]);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Stock Loader</h2>
      <button
        className="btn btn-primary w-full mb-3"
        onClick={loadStocks}
        disabled={loading}
      >
        {loading ? "Loading..." : "Load Stocks"}
      </button>

      <div className="bg-gray-100 p-3 rounded h-60 overflow-auto text-sm font-mono">
        {logs.map((log, idx) => (
          <p key={idx}>{log}</p>
        ))}
      </div>
    </div>
  );
}
