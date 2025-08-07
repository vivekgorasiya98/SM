import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Indices.css"; // same css file

export default function Indice({ backendURL }) {
  const { index } = useParams();
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${backendURL}/api/indices/${index}/`)
      .then(res => setStocks(res.data))
      .catch(() => setStocks([]));
  }, [index, backendURL]);

  if (!stocks.length) return <div className="loader-container">
    <div className="spinner-border text-success" role="status"></div>
    <p className="mt-3">Loading Constituents...</p>
  </div>;

  return (
    <div className="container mt-5 indices-page">
      <h2 className="mb-4 text-center fw-bold text-success">
        {index.replace("-", " ")} Constituents
      </h2>
      <div className="table-responsive shadow-lg rounded">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-success text-center">
            <tr>
              {Object.keys(stocks[0]).map((key, i) => (
                <th key={i} className="text-nowrap">{key}</th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {stocks.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j} className={j>1 && val && val.toString().includes("-") ? "text-danger fw-bold" : "text-success fw-bold"}>
                    {val || "-"}
                  </td>
                ))}
                <td>
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => navigate(`/stocks/${row['SYMBOL '] }`)}
                  >
                    View Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
