import React, { useEffect, useState } from "react";

export default function StockPerformance({ backendURL, symbol }) {
  const [stock, setStock] = useState(null);

  useEffect(() => {
    if (!symbol) return;
    fetch(`${backendURL}/api/stock/${symbol}/`)
      .then((res) => res.json())
      .then((data) => setStock(data))
      .catch((err) => console.error(err));
  }, [symbol, backendURL]);

  if (!stock)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <img
          src="/images/growing.gif"
          alt="Loading..."
          style={{ width: "80px", height: "80px", marginBottom: "20px" }}
        />
        <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#555" }}>
          Loading...
        </p>
      </div>
    );

  // Calculations
  const priceChange = stock.price - stock.open;
  const priceChangePercent =
    stock.open > 0 ? ((priceChange / stock.open) * 100).toFixed(2) : 0;

  const todayPos =
    stock.dayHigh && stock.dayLow
      ? ((stock.price - stock.dayLow) / (stock.dayHigh - stock.dayLow)) * 100
      : 0;

  const weekPos =
    stock.fiftyTwoWeekHigh && stock.fiftyTwoWeekLow
      ? ((stock.price - stock.fiftyTwoWeekLow) /
          (stock.fiftyTwoWeekHigh - stock.fiftyTwoWeekLow)) *
        100
      : 0;

  const priceColor = priceChange >= 0 ? "#00B386" : "#EB5B3C";

  return (
    <div className="container mt-5">
      {/* ===== Performance ===== */}
      <h3>Performance</h3>

      {/* Today Low-High */}
      <div className="d-flex justify-content-between pr-5 mt-4" style={{ width: "100%" }}>
        <span style={{ fontSize: "0.8rem" }}>Today`s Low</span>

        <div className="my-auto position-relative" style={{ width: "700px" }}>
          <div
            className="mt-4"
            style={{
              height: "6px",
              width: "100%",
              backgroundColor: "#c2c9d2",
              borderRadius: "6px",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              left: `${todayPos}%`,
              top: "30px",
            }}
          >
            <svg height="25" width="15">
              <polygon
                points="7.5,0 15,15 0,15"
                style={{ fill: "#44475B", stroke: "#44475B" }}
              />
            </svg>
          </div>
        </div>

        <span style={{ fontSize: "0.8rem" }}>Today`s High</span>
      </div>

      <div className="d-flex justify-content-between pr-5" style={{ marginTop: "0px" }}>
        <span>{stock.dayLow?.toFixed(2) || "N/A"}</span>
        <span>{stock.dayHigh?.toFixed(2) || "N/A"}</span>
      </div>

      {/* 52 Week Low-High */}
      <div className="d-flex justify-content-between pr-5 mt-4" style={{ width: "100%" }}>
        <span style={{ fontSize: "0.8rem" }}>52W Low</span>

        <div className="my-auto position-relative" style={{ width: "700px" }}>
          <div
            className="mt-4"
            style={{
              height: "6px",
              width: "100%",
              backgroundColor: "#c2c9d2",
              borderRadius: "6px",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              left: `${weekPos}%`,
              top: "30px",
            }}
          >
            <svg height="25" width="15">
              <polygon
                points="7.5,0 15,15 0,15"
                style={{ fill: "#44475B", stroke: "#44475B" }}
              />
            </svg>
          </div>
        </div>

        <span style={{ fontSize: "0.8rem" }}>52W High</span>
      </div>

      <div className="d-flex justify-content-between pr-5 " style={{ marginTop: "0px" }}>
        <span>{stock.fiftyTwoWeekLow?.toFixed(2) || "N/A"}</span>
        <span>{stock.fiftyTwoWeekHigh?.toFixed(2) || "N/A"}</span>
      </div>

      <div className="mt-5 mr-5">
        <div style={{ width: "100%", height: "1px", backgroundColor: "#ddd" }}></div>
      </div>

      {/* ===== Basic Info ===== */}
      <div className="mt-5 row justify-content-between">
        <div className="col-3">
          <span style={{ fontSize: "0.8rem" }}>Open</span>
          <br />
          <span>{stock.open?.toFixed(2) || "N/A"}</span>
        </div>
        <div className="col-3">
          <span style={{ fontSize: "0.8rem" }}>Prev. Close</span>
          <br />
          <span>{stock.previousClose?.toFixed(2) || "N/A"}</span>
        </div>
        <div className="col-3">
          <span style={{ fontSize: "0.8rem" }}>Volume</span>
          <br />
          <span>{stock.volume?.toLocaleString() || "N/A"}</span>
        </div>
        <div className="col-3">
          <span style={{ fontSize: "0.8rem" }}>Total traded value</span>
          <br />
          <span>
            {stock.volume && stock.price
              ? `${((stock.volume * stock.price) / 10000000).toFixed(2)} Cr`
              : "N/A"}
          </span>
        </div>
      </div>

      {/* ===== Analyst Estimates ===== */}
      <div className="mt-5">
        <h3>Analyst Estimates</h3>
        <div className="d-flex mt-5 gap-3">
          <div
            className="my-auto text-center"
            style={{
              height: "150px",
              width: "150px",
              backgroundColor:stock.analystColor,
              color: "#fff",
              borderRadius: "50%",
            }}
          >
            <br />
            <span style={{ fontSize: "4rem" ,}}>
              {stock.analystPercent || 0}
            </span>
            %
          </div>

          <div className="ml-5" style={{ marginTop: "1.25rem" }}>
            <div><span>Buy</span></div>
            <div style={{ marginTop: "1.25rem" }}><span>Hold</span></div>
            <div style={{ marginTop: "1.25rem" }}><span>Sell</span></div>
          </div>

          <div>
            <div className="pl-5 mt-4">
            <div className="d-flex ">
              <div
                style={{
                  height: "10px",
                  marginTop:'5px',
                  minWidth: `${stock.buyPercent*3 || 5}px`,
                  borderRadius: "2px",
                  backgroundColor: "#00B386",
                }}
              ></div>
              <span style={{ fontSize: "0.8rem",  }} className="m3-2 ">
                 &nbsp; {stock.buyPercent || 0}%
              </span>
            </div>
            <div className="d-flex mt-4">
              <div
                style={{
                  height: "10px",
                  marginTop:'5px',
                  minWidth: `${stock.holdPercent*3 || 5}px`,
                  borderRadius: "2px",
                  backgroundColor: "#7C7E8c",
                }}
              ></div>
              <span style={{ fontSize: "0.8rem" }} className="ml-2">
                &nbsp; {stock.holdPercent || 0}%
              </span>
            </div>
            <div className="d-flex mt-4">
              <div
                style={{
                  height: "10px",
                  marginTop:'5px',
                  minWidth: `${stock.sellPercent*3 || 5}px`,
                  borderRadius: "2px",
                  backgroundColor: "#EB5B3C",
                }}
              ></div>
              <span style={{ fontSize: "0.8rem" }} className="ml-2">
                 &nbsp;{stock.sellPercent || 0}%
              </span>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* ===== Fundamentals ===== */}
      <div className="mt-5">
        <h3>Fundamentals</h3>
        <div className="row justify-content-between mr-5 mt-5">
          <div className="col-6 div-r pr-5">
            <div className="d-flex justify-content-between">
              <span style={{ fontSize: "0.8rem" }}>Market Cap</span>
              <span>{stock.marketCap ? `${(stock.marketCap / 1e7).toFixed(2)} Cr` : "N/A"}</span>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <span style={{ fontSize: "0.8rem" }}>P/E Ratio(TTM)</span>
              <span>{stock.peRatio || "N/A"}</span>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <span style={{ fontSize: "0.8rem" }}>P/B Ratio</span>
              <span>{stock.pbRatio || "N/A"}</span>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <span style={{ fontSize: "0.8rem" }}>Industry P/E</span>
              <span>{stock.industryPE || "N/A"}</span>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <span style={{ fontSize: "0.8rem" }}>Recommendation</span>
              <span>{stock.recommendation || "N/A"}</span>
            </div>
          </div>

          <div className="col-6 div-l pl-5">
            <div className="d-flex justify-content-between">
              <span style={{ fontSize: "0.8rem" }}>ROE</span>
              <span>{stock.roe || "N/A"}</span>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <span style={{ fontSize: "0.8rem" }}>EPS(TTM)</span>
              <span>{stock.eps || "N/A"}</span>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <span style={{ fontSize: "0.8rem" }}>Dividend Yield</span>
              <span>{stock.dividendYield || "N/A"}</span>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <span style={{ fontSize: "0.8rem" }}>Book Value</span>
              <span>{stock.bookValue || "N/A"}</span>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <span style={{ fontSize: "0.8rem" }}>Quarter Growth</span>
              <span>{stock.quarterGrowth || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== About Section ===== */}
      <div className="mt-5">
        <h3>About {stock.name || stock.symbol}</h3>
        <div className="d-flex mt-5">
          <div><span>{stock.sector || "N/A"}</span></div>
          <span>&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;</span>
          <div>{stock.industry || "N/A"}</div>
        </div>
        <div className="mr-5 mt-4">
          <p style={{ fontSize: "0.8rem", textAlign: "justify" }}>
            {stock.about || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
