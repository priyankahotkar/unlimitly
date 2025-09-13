import React, { useEffect, useState, useRef } from "react";
import { TrendingUp, TrendingDown, Activity, BarChart3, Eye, Globe, ExternalLink, Newspaper } from "lucide-react";
import StockChart from "../components/StockChart";

interface StockData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
  change?: number;
  changePercent?: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
  marketCap?: number;
  pe?: number;
  sector?: string;
  companyName?: string;
  country?: string;
  currency?: string;
  logo?: string;
  weburl?: string;
  description?: string;
  employees?: number;
  revenue?: number;
  profitMargin?: number;
  roe?: number;
  debtToEquity?: number;
  currentRatio?: number;
  news?: NewsItem[];
}

interface NewsItem {
  id: number;
  headline: string;
  summary: string;
  url: string;
  datetime: number;
  source: string;
}

interface HistoricalData {
  timestamp: number;
  price: number;
  volume: number;
}


const LiveStocks: React.FC = () => {
  const [stocks, setStocks] = useState<Record<string, StockData>>({});
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D');
  const [chartType, setChartType] = useState<'line' | 'candlestick'>('line');
  const [historicalData, setHistoricalData] = useState<Record<string, HistoricalData[]>>({});
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change' | 'volume' | 'marketCap'>('symbol');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set());
  const reconnectRef = useRef<number>(1000);
  const wsRef = useRef<WebSocket | null>(null);

  // Generate mock historical data for demonstration
  const generateHistoricalData = (currentPrice: number): HistoricalData[] => {
    const data: HistoricalData[] = [];
    const now = Date.now();
    const intervals = timeRange === '1D' ? 24 : timeRange === '1W' ? 7 : timeRange === '1M' ? 30 : timeRange === '3M' ? 90 : 365;
    const intervalMs = timeRange === '1D' ? 3600000 : timeRange === '1W' ? 86400000 : timeRange === '1M' ? 86400000 : timeRange === '3M' ? 86400000 : 86400000;
    
    let price = currentPrice * 0.8; // Start 20% lower
    for (let i = intervals; i >= 0; i--) {
      const timestamp = now - (i * intervalMs);
      const volatility = 0.02; // 2% volatility
      const change = (Math.random() - 0.5) * volatility;
      price = Math.max(price * (1 + change), 0.01);
      
      data.push({
        timestamp,
        price: Number(price.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000) + 100000
      });
    }
    return data;
  };

  const connect = () => {
    const socket = new WebSocket("ws://localhost:3000");
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      reconnectRef.current = 1000;
      setIsLoading(false);
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Handle initial data from backend
        if (message.type === 'initial_data') {
          const initialStocks: Record<string, StockData> = {};
          message.data.forEach((stock: StockData) => {
            initialStocks[stock.symbol] = stock;
          });
          setStocks(initialStocks);
          setIsLoading(false);
          return;
        }
        
        // Handle historical data from backend
        if (message.type === 'historical_data') {
          const histData: Record<string, HistoricalData[]> = {};
          Object.entries(message.data).forEach(([symbol, data]: [string, any]) => {
            if (data && data.timestamps && data.closes) {
              histData[symbol] = data.timestamps.map((timestamp: number, index: number) => ({
                timestamp: timestamp * 1000, // Convert to milliseconds
                price: data.closes[index],
                volume: data.volumes[index] || 0
              }));
            }
          });
          setHistoricalData(histData);
          return;
        }
        
        // Handle real-time stock updates
        if (message.symbol && message.price) {
        setStocks((prev) => ({
          ...prev,
            [message.symbol]: message,
        }));
        }
      } catch (err) {
        console.error("Invalid WS message:", event.data, err);
      }
    };

    socket.onclose = () => {
      console.warn("⚠️ WebSocket disconnected. Reconnecting...");
      setIsLoading(true);
      setTimeout(connect, reconnectRef.current);
      reconnectRef.current = Math.min(reconnectRef.current * 2, 30000);
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

  // Update historical data when time range changes
  useEffect(() => {
    const newHistoricalData: Record<string, HistoricalData[]> = {};
    Object.entries(stocks).forEach(([symbol, stock]) => {
      newHistoricalData[symbol] = generateHistoricalData(stock.price);
    });
    setHistoricalData(newHistoricalData);
  }, [timeRange]);

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeBgColor = (change: number) => {
    return change >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  };

  const toggleWatchlist = (symbol: string) => {
    setWatchlist(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const handleLogoError = (symbol: string) => {
    setFailedLogos(prev => new Set(prev).add(symbol));
  };

  const shouldShowLogo = (symbol: string, logoUrl?: string) => {
    return logoUrl && !failedLogos.has(symbol);
  };

  const getFallbackAvatar = (symbol: string, size: 'small' | 'large' = 'small') => {
    const textSize = size === 'large' ? 'text-2xl' : 'text-sm';
    const dimensions = size === 'large' ? 'w-16 h-16' : 'w-10 h-10';
    
    // Generate a consistent color based on symbol
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600', 
      'from-purple-500 to-purple-600',
      'from-red-500 to-red-600',
      'from-yellow-500 to-yellow-600',
      'from-indigo-500 to-indigo-600',
      'from-pink-500 to-pink-600',
      'from-teal-500 to-teal-600'
    ];
    
    const colorIndex = symbol.charCodeAt(0) % colors.length;
    const colorClass = colors[colorIndex];
    
    // Use first 2 characters if available, otherwise just first character
    const displayText = symbol.length > 1 ? symbol.substring(0, 2) : symbol.charAt(0);

  return (
      <div className={`${dimensions} rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold ${textSize}`}>
        {displayText}
      </div>
    );
  };

  const sortedStocks = Object.values(stocks).sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'symbol':
        aValue = a.symbol;
        bValue = b.symbol;
        break;
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'change':
        aValue = a.change || 0;
        bValue = b.change || 0;
        break;
      case 'volume':
        aValue = a.volume;
        bValue = b.volume;
        break;
      case 'marketCap':
        aValue = a.marketCap || 0;
        bValue = b.marketCap || 0;
        break;
      default:
        aValue = a.symbol;
        bValue = b.symbol;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const StockCard: React.FC<{ stock: StockData }> = ({ stock }) => (
    <div 
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group relative"
      onClick={() => setSelectedStock(stock.symbol)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWatchlist(stock.symbol);
        }}
        className="absolute top-4 right-4 text-gray-400 hover:text-yellow-500 transition-colors"
      >
        {watchlist.includes(stock.symbol) ? '★' : '☆'}
      </button>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {shouldShowLogo(stock.symbol, stock.logo) ? (
            <img 
              src={stock.logo} 
              alt={`${stock.symbol} logo`}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
              onError={() => handleLogoError(stock.symbol)}
            />
          ) : (
            getFallbackAvatar(stock.symbol, 'small')
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-900">{stock.symbol}</h3>
            <p className="text-sm text-gray-500">{stock.companyName || stock.symbol}</p>
            <p className="text-xs text-gray-400">{stock.sector}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {stock.change && stock.change >= 0 ? (
            <TrendingUp className="w-5 h-5 text-green-600" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-600" />
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">${stock.price.toFixed(2)}</span>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getChangeBgColor(stock.change || 0)}`}>
            <span className={getChangeColor(stock.change || 0)}>
              {stock.change && stock.change >= 0 ? '+' : ''}{stock.change?.toFixed(2)} ({stock.changePercent?.toFixed(2)}%)
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Volume</span>
            <p className="font-semibold">{formatNumber(stock.volume)}</p>
          </div>
          <div>
            <span className="text-gray-500">Market Cap</span>
            <p className="font-semibold">${formatNumber(stock.marketCap || 0)}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>H: ${stock.high?.toFixed(2)}</span>
          <span>L: ${stock.low?.toFixed(2)}</span>
          <span>P/E: {stock.pe || 'N/A'}</span>
        </div>
        
        {stock.country && (
          <div className="flex items-center text-xs text-gray-500">
            <Globe className="w-3 h-3 mr-1" />
            <span>{stock.country}</span>
          </div>
        )}
      </div>
    </div>
  );

  const MiniChart: React.FC<{ data: HistoricalData[]; color: string }> = ({ data, color }) => {
    return (
      <div className="h-20 w-full">
        <StockChart data={data} color={color} height={80} />
      </div>
    );
  };

  const MarketOverview = () => {
    const stockValues = Object.values(stocks);
    const avgChangePercent = stockValues.length > 0 ? 
      stockValues.reduce((sum, stock) => sum + (stock.changePercent || 0), 0) / stockValues.length : 0;
    
    const totalMarketCap = stockValues.reduce((sum, stock) => sum + (stock.marketCap || 0), 0);
    const gainers = stockValues.filter(stock => (stock.change || 0) > 0).length;
    const losers = stockValues.filter(stock => (stock.change || 0) < 0).length;
    
    return (
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Market Overview</h2>
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6" />
            <span className="text-sm bg-green-500 px-2 py-1 rounded-full">Live</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div>
            <p className="text-blue-100 text-sm">Total Stocks</p>
            <p className="text-3xl font-bold">{stockValues.length}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Avg Change</p>
            <p className={`text-3xl font-bold ${avgChangePercent >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {avgChangePercent >= 0 ? '+' : ''}{avgChangePercent.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Total Volume</p>
            <p className="text-3xl font-bold">
              {formatNumber(stockValues.reduce((sum, stock) => sum + stock.volume, 0))}
            </p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Total Market Cap</p>
            <p className="text-3xl font-bold">
              ${formatNumber(totalMarketCap)}
            </p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Gainers / Losers</p>
            <p className="text-3xl font-bold">
              <span className="text-green-300">{gainers}</span> / <span className="text-red-300">{losers}</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Live Stock Market</h1>
          <p className="text-gray-600">Real-time financial data and analytics</p>
        </div>

        <MarketOverview />

        {/* Controls */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
          <div className="flex flex-wrap gap-2">
            <div className="flex space-x-2">
              {(['1D', '1W', '1M', '3M', '1Y'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setChartType('line')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  chartType === 'line'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Line
              </button>
              <button
                onClick={() => setChartType('candlestick')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  chartType === 'candlestick'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Eye className="w-4 h-4 inline mr-2" />
                Candlestick
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="symbol">Symbol</option>
                <option value="price">Price</option>
                <option value="change">Change</option>
                <option value="volume">Volume</option>
                <option value="marketCap">Market Cap</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
            
            {watchlist.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Watchlist:</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {watchlist.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Watchlist Section */}
        {watchlist.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">★</span>
              Watchlist ({watchlist.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {sortedStocks
                .filter(stock => watchlist.includes(stock.symbol))
                .map((stock) => (
                  <div key={stock.symbol} className="relative">
                    <StockCard stock={stock} />
                    <div className="mt-4">
                      <MiniChart 
                        data={historicalData[stock.symbol] || []} 
                        color={stock.change && stock.change >= 0 ? '#10b981' : '#ef4444'} 
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* All Stocks Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">All Stocks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {sortedStocks.map((stock) => (
              <div key={stock.symbol} className="relative">
                <StockCard stock={stock} />
                <div className="mt-4">
                  <MiniChart 
                    data={historicalData[stock.symbol] || []} 
                    color={stock.change && stock.change >= 0 ? '#10b981' : '#ef4444'} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Stock Detail */}
        {selectedStock && stocks[selectedStock] && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {shouldShowLogo(selectedStock, stocks[selectedStock].logo) ? (
                  <img 
                    src={stocks[selectedStock].logo} 
                    alt={`${selectedStock} logo`}
                    className="w-16 h-16 rounded-full object-cover border border-gray-200"
                    onError={() => handleLogoError(selectedStock)}
                  />
                ) : (
                  getFallbackAvatar(selectedStock, 'large')
                )}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stocks[selectedStock].companyName || selectedStock}
                  </h3>
                  <p className="text-gray-600">{selectedStock} • {stocks[selectedStock].sector}</p>
                  {stocks[selectedStock].weburl && (
                    <a 
                      href={stocks[selectedStock].weburl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Company Website
                    </a>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedStock(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h4 className="text-lg font-semibold mb-4">Price Chart</h4>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <StockChart 
                    data={historicalData[selectedStock] || []} 
                    color="#1d4ed8" 
                    height={300}
                    showVolume={true}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Trading Data</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Current Price</p>
                      <p className="text-xl font-bold">${stocks[selectedStock].price.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Change</p>
                      <p className={`text-xl font-bold ${getChangeColor(stocks[selectedStock].change || 0)}`}>
                        {stocks[selectedStock].change && stocks[selectedStock].change >= 0 ? '+' : ''}
                        {stocks[selectedStock].change?.toFixed(2)} ({stocks[selectedStock].changePercent?.toFixed(2)}%)
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Open</p>
                      <p className="text-xl font-bold">${stocks[selectedStock].open?.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">High</p>
                      <p className="text-xl font-bold">${stocks[selectedStock].high?.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Low</p>
                      <p className="text-xl font-bold">${stocks[selectedStock].low?.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Previous Close</p>
                      <p className="text-xl font-bold">${stocks[selectedStock].previousClose?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4">Company Info</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sector</span>
                      <span className="font-semibold">{stocks[selectedStock].sector}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Country</span>
                      <span className="font-semibold">{stocks[selectedStock].country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Currency</span>
                      <span className="font-semibold">{stocks[selectedStock].currency}</span>
                    </div>
                    {stocks[selectedStock].employees && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Employees</span>
                        <span className="font-semibold">{formatNumber(stocks[selectedStock].employees || 0)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4">Financial Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Market Cap</span>
                      <span className="font-semibold">${formatNumber(stocks[selectedStock].marketCap || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">P/E Ratio</span>
                      <span className="font-semibold">{stocks[selectedStock].pe || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Volume</span>
                      <span className="font-semibold">{formatNumber(stocks[selectedStock].volume)}</span>
                    </div>
                    {stocks[selectedStock].revenue && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Revenue (TTM)</span>
                        <span className="font-semibold">${formatNumber(stocks[selectedStock].revenue || 0)}</span>
                      </div>
                    )}
                    {stocks[selectedStock].profitMargin && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Profit Margin</span>
                        <span className="font-semibold">{(stocks[selectedStock].profitMargin * 100).toFixed(2)}%</span>
                      </div>
                    )}
                    {stocks[selectedStock].roe && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">ROE</span>
                        <span className="font-semibold">{(stocks[selectedStock].roe * 100).toFixed(2)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Company Description */}
            {stocks[selectedStock].description && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">About</h4>
                <p className="text-gray-700 leading-relaxed">{stocks[selectedStock].description}</p>
              </div>
            )}
            
            {/* News Section */}
            {stocks[selectedStock].news && stocks[selectedStock].news.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <Newspaper className="w-5 h-5 mr-2" />
                  Latest News
                </h4>
                <div className="space-y-4">
                  {stocks[selectedStock].news.slice(0, 3).map((newsItem, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <h5 className="font-semibold text-gray-900 mb-2">{newsItem.headline}</h5>
                      <p className="text-gray-600 text-sm mb-2">{newsItem.summary}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{newsItem.source}</span>
                        <span>{new Date(newsItem.datetime * 1000).toLocaleDateString()}</span>
                      </div>
        </div>
      ))}
                </div>
              </div>
            )}
          </div>
        )}

        {isLoading && Object.keys(stocks).length === 0 && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-500 mb-2">Loading Market Data</h3>
            <p className="text-gray-400">Fetching comprehensive financial data from Finnhub API...</p>
          </div>
        )}
        
        {!isLoading && Object.keys(stocks).length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No Data Available</h3>
            <p className="text-gray-400">Unable to connect to market data. Please check your connection.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveStocks;
