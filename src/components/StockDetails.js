import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Chart from "react-apexcharts";
import "./Detail.css";
import StockPerformance from "./StockPerformance";
import StockPredictor from "./StockPredictor";


export default function StockDetails({ backendURL }) {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState(null);
  const [chartType, setChartType] = useState("line");
  const [marketOpen, setMarketOpen] = useState(false);
  const [livePrice, setLivePrice] = useState(null);
  const [priceChange, setPriceChange] = useState(0);
  const intervalRef = useRef(null);
  // Full-day + live data
  const MAX_POINTS = 5000; // Keep enough for full-day per-second points

  // 1️⃣ Fetch full history initially
  useEffect(() => {
    axios.get(`${backendURL}/api/stock/${symbol}/`)
      .then(res => {
        const data = res.data;
        // Convert full-day data to line & candle friendly format
        data.history = data.history.map(h => ({
          x: new Date(h.time).getTime(),
          y: Number(h.price),
          open: Number(h.open),
          high: Number(h.high),
          low: Number(h.low),
          close: Number(h.price)
        }));

        setStock(data);
        // const lastPrice = data.history[data.history.length - 1].y;
        const lastPrice=data.price;
        setLivePrice(lastPrice);
        setPriceChange(lastPrice - Number(data.open));
        checkMarketOpen();
      })
      .catch(err => console.error(err));
  }, [symbol, backendURL]);

  // 2️⃣ Polling for live price per second
  useEffect(() => {
    if (!marketOpen || !stock) return;

    intervalRef.current = setInterval(async () => {
      try {
        const res = await axios.get(`${backendURL}/api/stock/${symbol}/latest/`);
        const newPrice = Number(res.data.price);
        const now = new Date(res.data.time).getTime();

        setLivePrice(newPrice);
        setPriceChange(newPrice - Number(stock.open));

        setStock(prev => {
          if (!prev) return prev;

          const lastCandle = prev.history[prev.history.length - 1];
          const newHistory = [...prev.history];

          // Update last candle if same second, else push new
          if (lastCandle && lastCandle.x === now) {
            lastCandle.y = newPrice;
            lastCandle.close = newPrice;
            lastCandle.high = Math.max(lastCandle.high, newPrice);
            lastCandle.low = Math.min(lastCandle.low, newPrice);
          } else {
            newHistory.push({
              x: now,
              y: newPrice,
              open: newPrice,
              high: newPrice,
              low: newPrice,
              close: newPrice
            });
          }

          // Keep chart smooth & lightweight
          if (newHistory.length > MAX_POINTS) newHistory.shift();

          return { ...prev, history: [...newHistory] };
        });
      } catch (err) {
        console.error("Price fetch error:", err);
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [marketOpen, stock, backendURL, symbol]);

  const checkMarketOpen = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    if ((hours > 9 || (hours === 9 && minutes >= 15)) && (hours < 15 || (hours === 15 && minutes <= 30))) {
      setMarketOpen(true);
    }
  };

  if (!stock) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // full viewport height
          width: "100vw",  // full viewport width
          backgroundColor: "#fff" // optional background
        }}
      >
        <img
          src="/images/growing.gif"
          alt="Loading..."
          style={{ width: "250px", height: "200px", marginBottom: "20px" }}
        />
        <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#555" }}>
          Loading...
        </p>
      </div>
    );
  }

  // Chart Data
  const lineData = stock.history.map(h => ({ x: h.x, y: h.y }));
  const candleData = stock.history.map(h => ({
    x: h.x,
    y: [h.open, h.high, h.low, h.close]
  }));

  const lineColor = (livePrice || stock.open) >= stock.open ? "#04B488" : "#ed5533";

  const options = {
    chart: {
      type: chartType,
      height: 400,
      background: "#fff",
      animations: {
        enabled: true,
        easing: "linear",
        speed: 1000,
        dynamicAnimation: { enabled: true, speed: 1000 }
      },
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    stroke: {
      curve: "smooth",
      width: chartType === "line" ? 2 : 1,
      colors: [lineColor]
    },
    xaxis: {
      type: "datetime",
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    grid: { show: false },
    tooltip: {
      x: { format: "HH:mm:ss" },
      y: { formatter: val => val.toFixed(2) }
    },
    plotOptions: {
      candlestick: {
        colors: { upward: "#00B386", downward: "#EB5B3C" },
        wick: { useFillColor: true }
      }
    }
  };


  const series =
    chartType === "line"
      ? [{ name: stock.symbol, data: lineData }]
      : [{ name: stock.symbol, data: candleData }];

  const priceColor = priceChange >= 0 ? "text-green" : "text-red";

  return (<div className="px-5 pt-2">
    <div className="d-flex  w-full ">
      {/* Left 2/3 Graph */}
      <div className="p-3" style={{ width: "66%" }}>
        <div className="d-flex justify-content-between">

          <div>
            <img
              src={`/logo/${stock.symbol}.NS.png`}
              alt={stock.symbol}
              style={{ height: '60px' }}
            />
            <br />
            <br />
            <span className="color p-24 p-bold">{stock.name}</span>
            <br />
            <div className="text-3xl font-bold my-2 flex items-center gap-2">
              <span className="color p-bold"><span className="p-28">₹{livePrice?.toFixed(2)}</span><span className={priceColor} >
                {priceChange >= 0
                  ? `+${priceChange.toFixed(2)} (${((priceChange / stock.open) * 100).toFixed(2)}%)`
                  : `${priceChange.toFixed(2)} (${((-priceChange / stock.open) * 100).toFixed(2)}%)`}
              </span></span>


            </div>

          </div>
          <div>        <span>{marketOpen ? "🟢" : "🔴"}</span>
            <button
              className="rounded" style={{ backgroundColor: 'white', border: 'solid 1px #ddd' }}
              onClick={() => setChartType(chartType === "line" ? "candlestick" : "line")}
            >
              <img
                src={chartType === "line" ? "/images/candle.png" : "/images/line.png"}
                alt={chartType === "line" ? "Show Candlestick Chart" : "Show Line Chart"}
                style={{ height: '30px', width: '40px' }}
              />
            </button>
          </div>

        </div>
        <div
          style={{
            borderTop: "1px dashed #c2c9d2", // text-dark color
            margin: "20px 0"
          }}
        ></div>

        <Chart options={options} series={series} type={chartType} height={400} />
      </div>

      <div className="p-3" style={{ width: "33%" }}>
        <StockPredictor backendURL={backendURL} symbol={symbol} />

      </div>
    </div>
    <div className="p-3 mt-5" style={{ width: '66%' }}>
      <h3 className="color ">Overview</h3>
      <br />
      <StockPerformance backendURL={backendURL} symbol={symbol} />

    </div>
  </div>
  );
}



