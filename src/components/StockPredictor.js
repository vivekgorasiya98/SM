import React, { useState } from "react";
import axios from "axios";

export default function StockPredictor({ backendURL, symbol }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    setPrediction(null);
    try {
      const res = await axios.get(`${backendURL}/api/predict/${symbol}/`);
      setPrediction(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to get prediction");
    }
    setLoading(false);
  };

  return (
    <div className="rounded p-3" style={{border:'1px solid #ddd'}}>
      <h3 className="text-xl font-bold mb-3">Stock Price Prediction</h3>
      <button
        onClick={handlePredict}
        className="px-4 py-2 bg-blue-600 rounded"
        disabled={loading}
      >
        {loading ? "Predicting..." : "Predict Price"}
      </button>

      {prediction && (
        <div className="mt-4">
          <h4 className="font-bold">{prediction.symbol} Predictions:</h4>
          <ul className="mt-2">
            <li>Next 1 Day: ₹{prediction.predictions["1D"]}</li>
            <li>Next 1 Week: ₹{prediction.predictions["1W"]}</li>
            <li>Next 1 Month: ₹{prediction.predictions["1M"]}</li>
            <li>Next 1 Year: ₹{prediction.predictions["1Y"]}</li>
          </ul>
          <p className="mt-2 text-gray-600">
            Latest Price: ₹{prediction.latestPrice}
          </p>
        </div>
      )}
    </div>
  );
}
