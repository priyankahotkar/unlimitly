import React, { useEffect, useState } from "react";

interface StockData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
}

const LiveStocks: React.FC = () => {
  const [stocks, setStocks] = useState<Record<string, StockData>>({});

  useEffect(() => {
    // Connect to your backend WebSocket
    const socket = new WebSocket("ws://localhost:3000");

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const data: StockData = JSON.parse(event.data);
        setStocks((prev) => ({
          ...prev,
          [data.symbol]: data, // Update stock by symbol
        }));
      } catch (err) {
        console.error("Invalid WS message:", event.data, err);
      }
    };

    socket.onclose = () => console.log("WebSocket disconnected");

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      {Object.values(stocks).map((stock) => (
        <div
          key={stock.symbol}
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            minWidth: "200px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
          }}
        >
          <h2 style={{ margin: 0 }}>{stock.symbol}</h2>
          <p style={{ margin: "5px 0" }}>
            <strong>Price:</strong> ${stock.price.toFixed(2)}
          </p>
          <p style={{ margin: "5px 0" }}>
            <strong>Volume:</strong> {stock.volume}
          </p>
          <p style={{ margin: "5px 0", fontSize: "12px", color: "#555" }}>
            {new Date(stock.timestamp).toLocaleTimeString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default LiveStocks;
