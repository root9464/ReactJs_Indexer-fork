import React, { useState, useEffect, useRef } from 'react';
import {
  ComposedChart,
  Line,
  LineChart,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { FaDollarSign } from 'react-icons/fa';
import GiftIndexLogo from '../assets/Giftindex_logo.svg';

// Компонент иконки TON
const TonIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className}>
    <path fill="#08C" d="M19.011 9.201L12.66 19.316a.857.857 0 0 1-1.453-.005L4.98 9.197a1.8 1.8 0 0 1-.266-.943a1.856 1.856 0 0 1 1.881-1.826h10.817c1.033 0 1.873.815 1.873 1.822c0 .334-.094.664-.274.951M6.51 8.863l4.632 7.144V8.143H6.994c-.48 0-.694.317-.484.72m6.347 7.144l4.633-7.144c.214-.403-.005-.72-.485-.720h-4.148z"/>
  </svg>
);

const token = {
  name: 'Tand • 53212 TON',
  symbol: '🎁 34',
  icon: 'https://raw.githubusercontent.com/mytonwalletorg/mytonwallet/master/public/ton.png',
  price: '+279.04%',
  priceDetail: '+181.58₽',
  marketCap: '$279.04K',
  currentVolume: '1,234.56',
  currentPurchases: '568',
  // Данные для топ-3 растущих коллекций
  chartData: [
    { pepe: 120.5, cake: 45.2, bracelet: 23.1, time: '00:00', date: 'Jan 10' },
    { pepe: 167.2, cake: 61.3, bracelet: 32.4, time: '01:00', date: 'Jan 10' },
    { pepe: 189.4, cake: 69.8, bracelet: 41.7, time: '02:00', date: 'Jan 10' },
    { pepe: 201.3, cake: 74.2, bracelet: 48.5, time: '03:00', date: 'Jan 11' },
    { pepe: 192.5, cake: 70.1, bracelet: 45.8, time: '04:00', date: 'Jan 11' },
    { pepe: 210.8, cake: 77.6, bracelet: 52.3, time: '05:00', date: 'Jan 11' },
    { pepe: 234.7, cake: 82.4, bracelet: 58.9, time: '06:00', date: 'Jan 12' },
    { pepe: 245.6, cake: 86.7, bracelet: 64.2, time: '07:00', date: 'Jan 12' },
    { pepe: 267.8, cake: 92.1, bracelet: 71.5, time: '08:00', date: 'Jan 12' },
    { pepe: 289.4, cake: 97.8, bracelet: 78.3, time: '09:00', date: 'Jan 13' },
    { pepe: 312.5, cake: 102.4, bracelet: 85.7, time: '10:00', date: 'Jan 13' },
    { pepe: 334.6, cake: 108.9, bracelet: 92.1, time: '11:00', date: 'Jan 13' },
    { pepe: 356.9, cake: 114.2, bracelet: 98.6, time: '12:00', date: 'Jan 14' },
    { pepe: 378.2, cake: 120.5, bracelet: 105.3, time: '13:00', date: 'Jan 14' },
    { pepe: 401.5, cake: 125.8, bracelet: 112.7, time: '14:00', date: 'Jan 14' },
    { pepe: 423.8, cake: 132.1, bracelet: 119.4, time: '15:00', date: 'Jan 15' },
    { pepe: 445.3, cake: 138.7, bracelet: 126.8, time: '16:00', date: 'Jan 15' },
    { pepe: 467.8, cake: 144.3, bracelet: 134.2, time: '17:00', date: 'Jan 15' },
    { pepe: 489.5, cake: 150.9, bracelet: 141.6, time: '18:00', date: 'Jan 16' },
    { pepe: 512.6, cake: 156.2, bracelet: 148.5, time: '19:00', date: 'Jan 16' },
    { pepe: 534.7, cake: 162.8, bracelet: 155.9, time: '20:00', date: 'Jan 16' },
    { pepe: 556.9, cake: 167.4, bracelet: 162.3, time: '21:00', date: 'Jan 17' },
    { pepe: 578.2, cake: 173.6, bracelet: 169.7, time: '22:00', date: 'Jan 17' },
    { pepe: 601.4, cake: 179.2, bracelet: 176.4, time: '23:00', date: 'Jan 17' }
  ]
};

const collections = [
  {
    id: 1,
    name: 'Plush Pepe',
    volume: '$142.8K',
    change: '+89.24%',
    purchases: '2344',
    icon: 'https://cdn.changes.tg/gifts/originals/5936013938331222567/Original.png',
    isNegative: false
  },
  {
    id: 2,
    name: 'Homemade Cake',
    volume: '$204.2K',
    change: '+76.45%',
    purchases: '2100000',
    icon: '🍰',
    isImage: false,
    color: 'bg-orange-500',
    isNegative: false
  },
  {
    id: 3,
    name: 'Nail Bracelet',
    volume: '$102.0K',
    change: '+65.18%',
    purchases: '340',
    icon: '🔗',
    isImage: false,
    color: 'bg-gray-600',
    isNegative: false
  },
  {
    id: 4,
    name: "Durov's Cap",
    volume: '$89.2K',
    change: '+34.40%',
    purchases: '2490',
    icon: 'https://cdn.changes.tg/gifts/originals/5915521180483191380/Original.png',
    isNegative: false
  },
  {
    id: 5,
    name: 'Lol Pop',
    volume: '$56.3K',
    change: '+23.25%',
    purchases: '340253',
    icon: 'https://cdn.changes.tg/gifts/originals/5170594532177215681/Original.png',
    isNegative: false
  },
  {
    id: 6,
    name: 'Star Badge',
    volume: '$34.1K',
    change: '-5.12%',
    purchases: '1250',
    icon: '⭐',
    isImage: false,
    color: 'bg-yellow-500',
    isNegative: true
  },
  {
    id: 7,
    name: 'Red Heart',
    volume: '$28.7K',
    change: '-12.34%',
    purchases: '890',
    icon: '❤️',
    isImage: false,
    color: 'bg-red-500',
    isNegative: true
  }
];

const timeframes = ['1D', '7D', '1М', '3М', 'All'];
const tabs = ['My Gifts', 'Market Cap', 'Volume', 'Gainers'];

const PopupCollectionChart = ({ open, onClose, collection, chartData, currentTonPrice = 3.0 }) => {
  const [activeCurrency, setActiveCurrency] = useState('TON');
  const [activeTimeframe, setActiveTimeframe] = useState('All');

  // Function for date formatting
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const priceChange = chartData.length > 1 ? 
        ((data.median_price - chartData[0].median_price) / chartData[0].median_price * 100) : 0;
      
      return (
        <div className="bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-xl">
          <p className="text-gray-600 text-xs mb-1">{formatDate(data.dt)}</p>
          <p className="text-gray-800 font-bold text-sm">
            {activeCurrency === 'TON' 
              ? `${data.median_price.toFixed(2)} TON` 
              : `$${(data.median_price * currentTonPrice).toFixed(2)}`
            }
          </p>
          <p className={`text-xs font-medium ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom dot on line
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (!payload) return null;
    
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={3} 
        fill="#10b981" 
        stroke="#ffffff" 
        strokeWidth={2}
        className="drop-shadow-sm"
      />
    );
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center transition-all duration-300 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{ background: open ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0)', transition: 'background 0.3s' }}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg bg-white rounded-t-2xl shadow-2xl p-2 pb-8 transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-full'}`}
        style={{
          minHeight: 450,
          marginBottom: '35px',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 5,
          maxWidth: '500px'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header and close button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center ml-6"
              style={{
                background: `radial-gradient(circle at 60% 40%, #10b981 60%, #059669 100%)`
              }}
            >
              <span className="text-2xl">⭐</span>
            </div>
            <div className="flex-1">
              <div className="font-bold text-base text-gray-800">{collection?.name}</div>
              <div className="text-sm text-gray-500">Gainers</div>
            </div>
          </div>
          
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-4xl leading-none p-4">×</button>
        </div>

        {/* Price Display Section */}
        <div className="px-6 mb-4 relative">
          {/* Currency Switch */}
          <div className="absolute top-0 right-6 flex bg-gray-100 rounded-lg p-1 z-20">
            <button
              onClick={() => setActiveCurrency('TON')}
              className={`flex items-center justify-center w-8 h-6 rounded transition-all duration-200 ${
                activeCurrency === 'TON'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <TonIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveCurrency('USDT')}
              className={`flex items-center justify-center w-8 h-6 rounded transition-all duration-200 ${
                activeCurrency === 'USDT'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaDollarSign className="w-3 h-3" />
            </button>
          </div>

          {/* Price Display */}
          <div className="text-left" style={{ marginLeft: '-10px' }}>
            <div className="flex items-center gap-2 ">
              <div className="flex items-baseline rounded-lg px-2 py-1">
                <span className="text-green-500 text-sm mr-1 flex items-center">▲</span>
                {activeCurrency === 'USDT' && (
                  <span className="text-xl font-mono font-bold text-green-500 tracking-wide mr-1">$</span>
                )}
                <span className="text-xl font-mono font-bold text-green-500 tracking-wide">
                  {activeCurrency === 'TON' 
                    ? (parseFloat(collection?.volume?.replace('$', '').replace('K', '')) / 1000).toFixed(2)
                    : (parseFloat(collection?.volume?.replace('$', '').replace('K', '')) / 1000 * currentTonPrice).toFixed(2)
                  }
                </span>
                {activeCurrency === 'TON' && (
                  <span className="text-sm text-gray-500 ml-1" style={{ transform: 'translateY(-1.2px)' }}>
                    TON
                  </span>
                )}
              </div>
              <span className="text-green-500 bg-green-100 rounded-lg px-2 py-1 font-medium text-xs">
                {collection?.change || '+0.0%'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Chart */}
        <div className="mb-4">
          <div className="text-xs ml-6 text-gray-500 mb-2">Price Dynamic</div>
          <div className="w-full h-48 px-1 ml-0 relative">
            {/* Водяной знак логотипа позади графика */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <img
                src={GiftIndexLogo}
                alt="GiftIndex"
                className="w-28 h-auto opacity-50"
                style={{
                  filter: 'grayscale(1) brightness(0.6)'
                }}
              />
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#059669"/>
                    <stop offset="50%" stopColor="#10b981"/>
                    <stop offset="100%" stopColor="#34d399"/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="dt"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                  }}
                />
                <YAxis 
                  domain={['dataMin - 0.1', 'dataMax + 0.1']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickMargin={8}
                  width={40}
                  tickFormatter={(value) => activeCurrency === 'TON' ? `${value.toFixed(1)}` : `$${(value * currentTonPrice).toFixed(0)}`}
                />
                <CartesianGrid 
                  horizontal={true} 
                  vertical={false} 
                  stroke="#f3f4f6" 
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey={activeCurrency === 'TON' ? 'median_price' : (entry) => entry.median_price * currentTonPrice}
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  fill="url(#priceGradient)"
                  dot={<CustomDot />}
                  activeDot={{ 
                    r: 5, 
                    fill: "#10b981", 
                    stroke: "#ffffff", 
                    strokeWidth: 3,
                    className: "drop-shadow-lg"
                  }}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend убираем, так как только одна линия */}
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-3 grid-rows-2 gap-x-6 gap-y-2 mt-2 items-center px-6">
          <div>
            <div className="text-xs text-gray-500">Changes</div>
            <div className="font-bold text-sm text-gray-800">
              {collection?.change}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Floor Price</div>
            <div className="font-bold text-sm text-gray-800">
              {activeCurrency === 'TON' 
                ? `${(parseFloat(collection?.volume?.replace('$', '').replace('K', '')) * 0.8).toFixed(1)} TON`
                : `$${(parseFloat(collection?.volume?.replace('$', '').replace('K', '')) * 0.8).toFixed(1)}`
              }
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Market Price</div>
            <div className="font-bold text-sm text-gray-800">
              {activeCurrency === 'TON' 
                ? `${(parseFloat(collection?.volume?.replace('$', '').replace('K', '')) * 1.2).toFixed(1)} TON`
                : `$${(parseFloat(collection?.volume?.replace('$', '').replace('K', '')) * 1.2).toFixed(1)}`
              }
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Volume</div>
            <div className="font-bold text-sm text-gray-800">
              {activeCurrency === 'TON' 
                ? collection?.volume?.replace('$', '').replace('K', '') + 'K TON'
                : collection?.volume
              }
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Purchase</div>
            <div className="font-bold text-sm text-gray-800">
              {collection?.purchases}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Market Cap</div>
            <div className="font-bold text-sm text-gray-800">
              {activeCurrency === 'TON' 
                ? `${(parseFloat(collection?.volume?.replace('$', '').replace('K', '')) * 2.5).toFixed(1)}K TON`
                : `$${(parseFloat(collection?.volume?.replace('$', '').replace('K', '')) * 2.5).toFixed(1)}K`
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GainersPage = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('All');
  const [activeTab, setActiveTab] = useState('Gainers');
  const [activeCurrency, setActiveCurrency] = useState('TON');
  const [activeFilter, setActiveFilter] = useState('UP');
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const navigate = useNavigate();

  // Get unique dates from chart data
  const uniqueDates = [...new Set(token.chartData.map(item => item.date))];

  // Filter collections based on activeFilter
  const filteredCollections = collections.filter(collection => {
    if (activeFilter === 'UP') {
      return !collection.isNegative;
    } else {
      return collection.isNegative;
    }
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const timeData = payload[0]?.payload?.time;
      const dateData = payload[0]?.payload?.date;
      
      return (
        <div className="bg-white px-3 py-2 border border-gray-200 rounded shadow-lg">
          {timeData && dateData && (
            <p className="text-gray-600 font-medium text-xs mb-1">
              {`${dateData} ${timeData}`}
            </p>
          )}
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-medium text-sm">
              {`${entry.name}: ${entry.value.toFixed(1)}K`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Функция для получения данных графика конкретной коллекции
  const getChartDataForCollection = (collection) => {
    if (!collection) return [];
    
    // Генерируем моковые данные для графика коллекции с median_price
    const days = 7;
    const basePrice = parseFloat(collection.volume?.replace('$', '').replace('K', '')) / 1000 || 1; // конвертируем объем в цену
    const chartData = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      
      const variation = (Math.random() - 0.5) * 0.2; // ±10% вариация
      const price = basePrice * (1 + variation);
      
      chartData.push({
        dt: date.toISOString(),
        median_price: price
      });
    }
    
    return chartData;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full max-w-lg">
        {/* User Info Header */}
        <div className="flex justify-center py-4">
          <div className="inline-flex items-center border border-gray-300 rounded-2xl px-3 py-2 bg-white shadow-sm">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-xs font-bold">T</span>
            </div>
            <span className="text-gray-700 font-bold text-sm">{token.name} • </span>
            <span className="text-orange-500 font-bold text-sm">{token.symbol}</span>
          </div>
        </div>

        {/* Chart Container with Time Frame Buttons */}
        <div className="px-2 -mt-3">
          <div className="bg-white rounded-2xl p-4 relative">
            
          

            {/* Top Gainers Display */}
            <div className="mb-5 text-left">
              <div className="flex items-center justify-center mb-3 -ml-2">
                <div className="flex items-center rounded-lg px-2 py-1">
                  <img 
                    src="https://cdn.changes.tg/gifts/originals/5936013938331222567/Original.png" 
                    alt="Plush Pepe"
                    className="w-4 h-4 mr-1 rounded-sm"
                  />
                  <span className="text-sm font-mono font-bold text-blue-500 tracking-wide">
                    +89.24%
                  </span>
                </div>
                <div className="flex items-center rounded-lg px-2 py-1">
                  <span className="text-lg mr-1">🍰</span>
                  <span className="text-sm font-mono font-bold text-green-500 tracking-wide">
                    +76.45%
                  </span>
                </div>
                <div className="flex items-center rounded-lg px-2 py-1">
                  <span className="text-lg mr-1">🔗</span>
                  <span className="text-sm font-mono font-bold text-purple-500 tracking-wide">
                    +65.18%
                  </span>
                </div>
              </div>
              <div className="text-gray-500 text-sm">24h Top Gainers</div>
            </div>

            {/* Chart */}
            <div className="w-full h-40 mb-3 relative">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={token.chartData} margin={{ left: 20, right: 22 }}>
                  <XAxis hide />
                  <YAxis 
                    hide
                    domain={[0, 650]}
                  />
                  <CartesianGrid 
                    horizontal={true} 
                    vertical={false} 
                    stroke="#e5e7eb" 
                    strokeWidth={0.5}
                    strokeOpacity={0.3}
                  />
                  <Tooltip 
                    content={<CustomTooltip />} 
                    animationDuration={150}
                  />
                  <Line
                    type="monotone"
                    dataKey="pepe"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    name="Plush Pepe"
                    animationDuration={300}
                  />
                  <Line
                    type="monotone"
                    dataKey="cake"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    name="Homemade Cake"
                    animationDuration={300}
                  />
                  <Line
                    type="monotone"
                    dataKey="bracelet"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={false}
                    name="Nail Bracelet"
                    animationDuration={300}
                  />
                </ComposedChart>
              </ResponsiveContainer>
              
              {/* Volume markers (left side) */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-2">
                <span>650K</span>
                <span>450K</span>
                <span>250K</span>
                <span>0</span>
              </div>
            </div>

            {/* Date markers (bottom) */}
            <div className="flex justify-between text-xs text-gray-400 px-6 mb-3 mt-2">
              {uniqueDates.filter((_, index) => index % 2 === 0).map((date, index) => (
                <span key={index} className="text-xs">{date}</span>
              ))}
            </div>

            {/* Time Frame Buttons */}
            <div className="flex justify-center gap-4 bg-gray-100 rounded-2xl p-1">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setActiveTimeframe(timeframe)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                    activeTimeframe === timeframe
                      ? 'bg-white text-gray-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 mb-4">
          <div className="flex mb-4 gap-2 justify-between">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  if (tab === 'My Gifts') {
                    navigate('/');
                  } else if (tab === 'Market Cap') {
                    navigate('/market');
                  } else if (tab === 'Volume') {
                    navigate('/volume');
                  } else if (tab === 'Gainers') {
                    navigate('/gainers');
                  } else {
                    setActiveTab(tab);
                  }
                }}
                className={`py-2 px-1 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-blue-500 border-blue-500'
                    : 'text-gray-400 border-transparent hover:text-blue-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Collections Header */}
        <div className="px-4 mb-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-xs font-medium">COLLECTIONS</span>
            <div className="flex items-center gap-2">
              <div className={`w-1 h-1 rounded-full ${
                activeFilter === 'UP' ? 'bg-blue-500' : 'bg-gray-300'
              }`} />
              <button
                onClick={() => setActiveFilter('UP')}
                className={`text-xs font-medium transition-colors ${
                  activeFilter === 'UP' ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                UP
              </button>
              <div className={`w-1 h-1 rounded-full ${
                activeFilter === 'DOWN' ? 'bg-blue-500' : 'bg-gray-300'
              }`} />
              <button
                onClick={() => setActiveFilter('DOWN')}
                className={`text-xs font-medium transition-colors ${
                  activeFilter === 'DOWN' ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                DOWN
              </button>
            </div>
          </div>
        </div>

        {/* Collections List */}
        <div className="space-y-1 px-8">
          {filteredCollections.map((collection) => (
            <div 
              key={collection.id} 
              className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => {
                setSelectedCollection(collection);
                setPopupOpen(true);
              }}
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 ${collection.isImage === false ? collection.color : ''} rounded-full flex items-center justify-center mr-3`}>
                  {collection.isImage === false ? (
                    <span className="text-lg">{collection.icon}</span>
                  ) : (
                    <img 
                      src={collection.icon} 
                      alt={collection.name}
                      className="w-10 h-10 object-cover"
                    />
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{collection.name}</div>
                  <div className="text-sm text-gray-500">{collection.purchases} Purchases</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">{collection.volume}</div>
                <div className={`text-sm ${collection.isNegative ? 'text-red-500' : 'text-green-500'}`}>
                  {collection.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Popup with chart */}
      <PopupCollectionChart
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        collection={selectedCollection}
        chartData={selectedCollection ? getChartDataForCollection(selectedCollection) : []}
        currentTonPrice={3.0}
      />
    </div>
  );
};

export default GainersPage;
