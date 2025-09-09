import React, { useEffect, useState, useRef } from "react";

interface StockData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
}

const LiveStocks: React.FC = () => {
  const [stocks, setStocks] = useState<Record<string, StockData>>({});
  const reconnectRef = useRef<number>(1000); // start with 1s retry delay
  const wsRef = useRef<WebSocket | null>(null);

  const connect = () => {
    const socket = new WebSocket("ws://localhost:3000");
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      reconnectRef.current = 1000; // reset delay after successful connect
    };

    socket.onmessage = (event) => {
      try {
        const data: StockData = JSON.parse(event.data);
        setStocks((prev) => ({
          ...prev,
          [data.symbol]: data,
        }));
      } catch (err) {
        console.error("Invalid WS message:", event.data, err);
      }
    };

    socket.onclose = () => {
      console.warn("⚠️ WebSocket disconnected. Reconnecting...");
      setTimeout(connect, reconnectRef.current);
      reconnectRef.current = Math.min(reconnectRef.current * 2, 30000); // backoff up to 30s
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
      socket.close();
    };
  };

  useEffect(() => {
    connect();

    return () => {
      wsRef.current?.close();
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
