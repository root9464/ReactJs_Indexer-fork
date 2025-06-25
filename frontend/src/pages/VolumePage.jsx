import React, { useState, useEffect, useRef } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid
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
  // Данные с оборотом и покупками
  chartData: [
    { volume: 120.5, purchases: 45, time: '00:00', date: 'Jan 10' }, { volume: 167.2, purchases: 61, time: '01:00', date: 'Jan 10' }, { volume: 189.4, purchases: 69, time: '02:00', date: 'Jan 10' },
    { volume: 201.3, purchases: 74, time: '03:00', date: 'Jan 11' }, { volume: 192.5, purchases: 70, time: '04:00', date: 'Jan 11' }, { volume: 210.8, purchases: 77, time: '05:00', date: 'Jan 11' },
    { volume: 234.7, purchases: 82, time: '06:00', date: 'Jan 12' }, { volume: 245.6, purchases: 86, time: '07:00', date: 'Jan 12' }, { volume: 267.8, purchases: 92, time: '08:00', date: 'Jan 12' },
    { volume: 289.4, purchases: 97, time: '09:00', date: 'Jan 13' }, { volume: 312.5, purchases: 102, time: '10:00', date: 'Jan 13' }, { volume: 334.6, purchases: 108, time: '11:00', date: 'Jan 13' },
    { volume: 356.9, purchases: 114, time: '12:00', date: 'Jan 14' }, { volume: 378.2, purchases: 120, time: '13:00', date: 'Jan 14' }, { volume: 401.5, purchases: 125, time: '14:00', date: 'Jan 14' },
    { volume: 423.8, purchases: 132, time: '15:00', date: 'Jan 15' }, { volume: 445.3, purchases: 138, time: '16:00', date: 'Jan 15' }, { volume: 467.8, purchases: 144, time: '17:00', date: 'Jan 15' },
    { volume: 489.5, purchases: 150, time: '18:00', date: 'Jan 16' }, { volume: 512.6, purchases: 156, time: '19:00', date: 'Jan 16' }, { volume: 534.7, purchases: 162, time: '20:00', date: 'Jan 16' },
    { volume: 556.9, purchases: 167, time: '21:00', date: 'Jan 17' }, { volume: 578.2, purchases: 173, time: '22:00', date: 'Jan 17' }, { volume: 601.4, purchases: 179, time: '23:00', date: 'Jan 17' }
  ]
};

const collections = [
  {
    id: 1,
    name: 'Plush Pepe',
    volume: '$142.8K',
    change: '-20.24%',
    purchases: '2344',
    icon: 'https://cdn.changes.tg/gifts/originals/5936013938331222567/Original.png',
    isNegative: true
  },
  {
    id: 2,
    name: "Durov's Cap",
    volume: '$89.2K',
    change: '+0.40%',
    purchases: '2490',
    icon: 'https://cdn.changes.tg/gifts/originals/5915521180483191380/Original.png',
    isNegative: false
  },
  {
    id: 3,
    name: 'Lol Pop',
    volume: '$56.3K',
    change: '+23.25%',
    purchases: '340253',
    icon: 'https://cdn.changes.tg/gifts/originals/5170594532177215681/Original.png',
    isNegative: false
  },
  {
    id: 4,
    name: 'Homemade Cake',
    volume: '$204.2K',
    change: '+23.24%',
    purchases: '2100000',
    icon: '🍰',
    isImage: false,
    color: 'bg-orange-500',
    isNegative: false
  },
  {
    id: 5,
    name: 'Nail Bracelet',
    volume: '$102.0K',
    change: '+23.24%',
    purchases: '340',
    icon: '🔗',
    isImage: false,
    color: 'bg-gray-600',
    isNegative: false
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
      
      // Рассчитываем данные для Portals и Tonnel
      const portalsVolume = data.volume * 0.25;
      const tonnelVolume = data.volume * 0.4;
      const portalsPurchases = Math.floor(data.purchases * 0.15);
      const tonnelPurchases = Math.floor(data.purchases * 0.3);
      
      return (
        <div className="bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-xl">
          <p className="text-gray-600 text-xs mb-2">{formatDate(data.dt)}</p>
          
          <div className="mb-2">
            <p className="text-gray-800 font-bold text-sm mb-1">Portals:</p>
            <p className="text-gray-700 text-xs ml-2">
              purchases: {portalsPurchases}
            </p>
            <p className="text-gray-700 text-xs ml-2">
              Volume: {activeCurrency === 'TON' 
                ? `${portalsVolume.toFixed(1)} TON` 
                : `$${(portalsVolume * currentTonPrice).toFixed(1)}`
              }
            </p>
          </div>
          
          <div>
            <p className="text-gray-800 font-bold text-sm mb-1">Tonnel:</p>
            <p className="text-gray-700 text-xs ml-2">
              purchases: {tonnelPurchases}
            </p>
            <p className="text-gray-700 text-xs ml-2">
              Volume: {activeCurrency === 'TON' 
                ? `${tonnelVolume.toFixed(1)} TON` 
                : `$${(tonnelVolume * currentTonPrice).toFixed(1)}`
              }
            </p>
          </div>
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
              <div className="text-sm text-gray-500">Volume</div>
            </div>
          </div>
          
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-4xl leading-none p-4">×</button>
        </div>

        {/* Volume Display Section */}
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

          {/* Volume Display */}
          <div className="text-left" style={{ marginLeft: '-9px' }}>
            <div className="flex items-center gap-2 ">
              <div className="flex items-center rounded-lg px-2 py-1">
                <span className="text-blue-500 text-sm mr-1 flex items-center">■</span>
                <span className="text-xl font-mono font-bold text-blue-500 tracking-wide">
                  {activeCurrency === 'TON' 
                    ? collection?.volume?.replace('$', '').replace('K', '') + 'K TON'
                    : collection?.volume
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart */}
        <div className="mb-4">
          <div className="text-xs ml-6 text-gray-500 mb-2">Volume Dynamic</div>
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
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6"/>
                    <stop offset="50%" stopColor="#60a5fa"/>
                    <stop offset="100%" stopColor="#93c5fd"/>
                  </linearGradient>
                  <linearGradient id="purchasesGradient" x1="0" y1="0" x2="1" y2="0">
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
                  yAxisId="volume"
                  orientation="left"
                  domain={['dataMin - 10', 'dataMax + 10']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickMargin={8}
                  width={40}
                  tickFormatter={(value) => activeCurrency === 'TON' ? `${value.toFixed(0)}` : `$${(value * currentTonPrice).toFixed(0)}`}
                />
                <YAxis 
                  yAxisId="purchases"
                  orientation="right"
                  domain={['dataMin - 5', 'dataMax + 5']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickMargin={8}
                  width={40}
                />
                <CartesianGrid 
                  horizontal={true} 
                  vertical={false} 
                  stroke="#f3f4f6" 
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <Tooltip content={<CustomTooltip />} />
                {/* Volume Line */}
                <Line
                  yAxisId="volume"
                  type="monotone"
                  dataKey={activeCurrency === 'TON' ? 'volume' : (entry) => entry.volume * currentTonPrice}
                  stroke="url(#volumeGradient)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ 
                    r: 4, 
                    fill: "#3b82f6", 
                    stroke: "#ffffff", 
                    strokeWidth: 2,
                    className: "drop-shadow-lg"
                  }}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
                {/* Purchases Line */}
                <Line
                  yAxisId="purchases"
                  type="monotone"
                  dataKey="purchases"
                  stroke="url(#purchasesGradient)"
                  strokeWidth={3}
                  dot={false}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-3 px-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-600">Portals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">Tonnel</span>
            </div>
          </div>
          
          {/* Timeframes */}
          <div className="flex justify-center mb-3 px-6 mt-4">
            <div className="flex bg-gray-100 rounded-lg p-1 w-full">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setActiveTimeframe(timeframe)}
                  className={`flex-1 py-1 text-xs font-medium rounded transition-all duration-200 ${
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
        
        {/* Statistics */}
        <div className="grid grid-cols-3 grid-rows-2 gap-x-6 gap-y-2 mt-2 items-center px-6">
          <div>
            <div className="text-xs text-gray-500">Tonnel Purchases</div>
            <div className="font-bold text-sm text-gray-800">
              {Math.floor(parseFloat(collection?.purchases?.replace(',', '') || 0) * 0.3)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Tonnel Volume</div>
            <div className="font-bold text-sm text-gray-800">
              {activeCurrency === 'TON' 
                ? `${(parseFloat(collection?.volume?.replace('$', '').replace('K', '')) * 0.4).toFixed(1)}K TON`
                : `${(parseFloat(collection?.volume?.replace('$', '').replace('K', '')) * 0.6).toFixed(1)}K`
              }
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Total</div>
            <div className="font-bold text-sm text-gray-800">
              {activeCurrency === 'TON' 
                ? `${(parseFloat(collection?.volume?.replace('$', '').replace('K', '')) * 1.2).toFixed(1)}K TON`
                : collection?.volume
              }
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Portals Purchases</div>
            <div className="font-bold text-sm text-gray-800">
              {Math.floor(parseFloat(collection?.purchases?.replace(',', '') || 0) * 0.15)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Portals Volume</div>
            <div className="font-bold text-sm text-gray-800">
              {activeCurrency === 'TON' 
                ? `${(parseFloat(collection?.volume?.replace('$', '').replace('K', '')) * 0.25).toFixed(1)}K TON`
                : `${(parseFloat(collection?.volume?.replace('$', '').replace('K', '')) * 0.35).toFixed(1)}K`
              }
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Total</div>
            <div className="font-bold text-sm text-gray-800">
              {activeCurrency === 'TON' 
                ? `${(parseFloat(collection?.volume?.replace('$', '').replace('K', '')) * 0.8).toFixed(1)}K TON`
                : `${(parseFloat(collection?.volume?.replace('$', '').replace('K', '')) * 1.1).toFixed(1)}K`
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VolumePage = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('All');
  const [activeTab, setActiveTab] = useState('Volume');
  const [activeCurrency, setActiveCurrency] = useState('TON');
  const [activeFilter, setActiveFilter] = useState('UP');
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const navigate = useNavigate();

  // Get unique dates from chart data
  const uniqueDates = [...new Set(token.chartData.map(item => item.date))];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const volumeData = payload.find(p => p.dataKey === 'volume');
      const purchasesData = payload.find(p => p.dataKey === 'purchases');
      const timeData = payload[0]?.payload?.time;
      const dateData = payload[0]?.payload?.date;
      
      return (
        <div className="bg-white px-3 py-2 border border-gray-200 rounded shadow-lg">
          {timeData && dateData && (
            <p className="text-gray-600 font-medium text-xs mb-1">
              {`${dateData} ${timeData}`}
            </p>
          )}
          {volumeData && (
            <p className="text-blue-600 font-medium text-sm">
              {`Volume: ${volumeData.value.toFixed(1)}K`}
            </p>
          )}
          {purchasesData && (
            <p className="text-green-600 font-medium text-sm">
              {`Purchases: ${purchasesData.value}`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Функция для получения данных графика конкретной коллекции
  const getChartDataForCollection = (collection) => {
    if (!collection) return [];
    
    // Генерируем моковые данные для графика коллекции с volume и purchases
    const days = 7;
    const baseVolume = parseFloat(collection.volume?.replace('$', '').replace('K', '')) || 100;
    const basePurchases = parseFloat(collection.purchases?.replace(',', '')) || 1000;
    const chartData = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      
      const volumeVariation = (Math.random() - 0.5) * 0.3; // ±15% вариация
      const purchasesVariation = (Math.random() - 0.5) * 0.2; // ±10% вариация
      
      const volume = baseVolume * (1 + volumeVariation);
      const purchases = Math.floor(basePurchases * 0.05 * (1 + purchasesVariation)); // 5% от общих покупок в день
      
      chartData.push({
        dt: date.toISOString(),
        volume: volume,
        purchases: purchases
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
            
            {/* Currency Switch */}
            <div className="absolute top-4 right-1 flex bg-gray-100 rounded-lg p-1 z-20">
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

            {/* Volume & Purchases Display */}
            <div className="mb-5 text-left">
              <div className="flex items-center gap-3 mb-1 -ml-2">
                <div className="flex items-center rounded-lg px-2 py-1">
                  <span className="text-blue-500 text-xs mr-1">■</span>
                  <span className="text-lg font-mono font-bold text-blue-500 tracking-wide">
                    {activeCurrency === 'TON' ? token.currentVolume : (parseFloat(token.currentVolume) * 0.18).toFixed(2)}K
                  </span>
                </div>
                <div className="flex items-center rounded-lg px-2 py-1">
                  <span className="text-green-500 text-xs mr-1">●</span>
                  <span className="text-lg font-mono font-bold text-green-500 tracking-wide">
                    {activeCurrency === 'TON' ? token.currentPurchases : Math.round(parseFloat(token.currentPurchases) * 0.18)}
                  </span>
                  <span className="text-gray-500 text-xs ml-1">Purchases</span>
                </div>
              </div>
              <div className="text-gray-500 text-sm">24h Volume & Purchases</div>
            </div>

            {/* Chart */}
            <div className="w-full h-40 mb-3 relative">
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
                <ComposedChart data={token.chartData} margin={{ left: 20, right: 22 }} barCategoryGap="10%">
                  <XAxis hide />
                  <YAxis 
                    yAxisId="volume"
                    orientation="left"
                    hide
                    domain={[0, 650]}
                  />
                  <YAxis 
                    yAxisId="purchases"
                    orientation="right"
                    hide
                    domain={[0, 200]}
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
                  <Bar
                    yAxisId="volume"
                    dataKey="volume"
                    fill="#3b82f6"
                    opacity={0.7}
                    radius={[1, 1, 0, 0]}
                    animationDuration={300}
                  />
                  <Line
                    yAxisId="purchases"
                    type="monotone"
                    dataKey="purchases"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
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
              
              {/* Purchases markers (right side) */}
              <div className="absolute right-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-2">
                <span>200</span>
                <span>140</span>
                <span>80</span>
                <span>0</span>
              </div>
            </div>

            {/* Date markers (bottom) - moved above timeframes */}
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
          {collections.map((collection) => (
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

export default VolumePage;
