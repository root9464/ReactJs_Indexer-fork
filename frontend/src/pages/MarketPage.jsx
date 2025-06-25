import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  Area,
  AreaChart,
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
  price: '+279.0%',
  priceDetail: '+181.6',
  marketCap: '$279.0K',
  currentPriceTON: '4734.8',
  currentPriceUSDT: '14204.3',
  midPrice: '4504.4',
  lowPrice: '4274.0',
  bottomPrice: '4043.7',
  // Данные с высокой волатильностью и датами
  chartData: [
    { value: 43.66, time: '00:00', date: 'Jan 10' }, { value: 48.2, time: '01:00', date: 'Jan 10' }, { value: 41.1, time: '02:00', date: 'Jan 10' }, { value: 52.8, time: '03:00', date: 'Jan 10' }, { value: 45.2, time: '04:00', date: 'Jan 10' },
    { value: 49.7, time: '05:00', date: 'Jan 11' }, { value: 295.1, time: '06:00', date: 'Jan 11' }, { value: 55.3, time: '07:00', date: 'Jan 11' }, { value: 38.8, time: '08:00', date: 'Jan 11' }, { value: 58.5, time: '09:00', date: 'Jan 11' },
    { value: 44.9, time: '10:00', date: 'Jan 12' }, { value: 51.2, time: '11:00', date: 'Jan 12' }, { value: 47.1, time: '12:00', date: 'Jan 12' }, { value: 53.6, time: '13:00', date: 'Jan 12' }, { value: 40.3, time: '14:00', date: 'Jan 12' },
    { value: 56.7, time: '15:00', date: 'Jan 13' }, { value: 43.9, time: '16:00', date: 'Jan 13' }, { value: 59.4, time: '17:00', date: 'Jan 13' }, { value: 46.8, time: '18:00', date: 'Jan 13' }, { value: 52.5, time: '19:00', date: 'Jan 13' },
    { value: 54.2, time: '20:00', date: 'Jan 14' }, { value: 48.6, time: '21:00', date: 'Jan 14' }, { value: 61.8, time: '22:00', date: 'Jan 14' }, { value: 490.4, time: '23:00', date: 'Jan 14' }, { value: 58.1, time: '00:00', date: 'Jan 15' },
    { value: 50.4, time: '01:00', date: 'Jan 15' }, { value: 44.2, time: '02:00', date: 'Jan 15' }, { value: 60.8, time: '03:00', date: 'Jan 15' }, { value: 47.9, time: '04:00', date: 'Jan 15' }, { value: 61.5, time: '05:00', date: 'Jan 15' },
    { value: 280.4, time: '06:00', date: 'Jan 16' }, { value: 295.1, time: '07:00', date: 'Jan 16' }, { value: 265.4, time: '08:00', date: 'Jan 16' }, { value: 310.7, time: '09:00', date: 'Jan 16' }, { value: 275.4, time: '10:00', date: 'Jan 16' },
    { value: 320.0, time: '11:00', date: 'Jan 17' }, { value: 260.7, time: '12:00', date: 'Jan 17' }, { value: 315.0, time: '13:00', date: 'Jan 17' }, { value: 285.3, time: '14:00', date: 'Jan 17' }, { value: 298.0, time: '15:00', date: 'Jan 17' },
    { value: 270.6, time: '16:00', date: 'Jan 18' }, { value: 325.3, time: '17:00', date: 'Jan 18' }, { value: 290.6, time: '18:00', date: 'Jan 18' }, { value: 305.9, time: '19:00', date: 'Jan 18' }, { value: 278.6, time: '20:00', date: 'Jan 18' },
    { value: 330.2, time: '21:00', date: 'Jan 19' }, { value: 295.9, time: '22:00', date: 'Jan 19' }, { value: 295.1, time: '23:00', date: 'Jan 19' }, { value: 285.5, time: '00:00', date: 'Jan 20' }, { value: 318.2, time: '01:00', date: 'Jan 20' },
    { value: 480.4, time: '02:00', date: 'Jan 20' }, { value: 515.8, time: '03:00', date: 'Jan 20' }, { value: 295.1, time: '04:00', date: 'Jan 20' }, { value: 535.8, time: '05:00', date: 'Jan 20' }, { value: 475.4, time: '06:00', date: 'Jan 20' },
    { value: 545.1, time: '07:00', date: 'Jan 21' }, { value: 460.4, time: '08:00', date: 'Jan 21' }, { value: 525.7, time: '09:00', date: 'Jan 21' }, { value: 490.4, time: '10:00', date: 'Jan 21' }, { value: 520.0, time: '11:00', date: 'Jan 21' },
    { value: 505.7, time: '12:00', date: 'Jan 22' }, { value: 540.0, time: '13:00', date: 'Jan 22' }, { value: 485.0, time: '14:00', date: 'Jan 22' }, { value: 530.3, time: '15:00', date: 'Jan 22' }, { value: 495.6, time: '16:00', date: 'Jan 22' },
    { value: 680.4, time: '17:00', date: 'Jan 23' }, { value: 295.1, time: '18:00', date: 'Jan 23' }, { value: 650.1, time: '19:00', date: 'Jan 23' }, { value: 735.8, time: '20:00', date: 'Jan 23' }, { value: 665.4, time: '21:00', date: 'Jan 23' },
    { value: 745.1, time: '22:00', date: 'Jan 24' }, { value: 640.4, time: '23:00', date: 'Jan 24' }, { value: 750.7, time: '00:00', date: 'Jan 25' }, { value: 675.4, time: '01:00', date: 'Jan 25' }, { value: 720.0, time: '02:00', date: 'Jan 25' },
    { value: 695.7, time: '03:00', date: 'Jan 25' }, { value: 740.0, time: '04:00', date: 'Jan 25' }, { value: 685.0, time: '05:00', date: 'Jan 25' }, { value: 295.1, time: '06:00', date: 'Jan 25' }, { value: 710.6, time: '07:00', date: 'Jan 25' },
    { value: 725.3, time: '08:00', date: 'Jan 25' }, { value: 715.6, time: '09:00', date: 'Jan 25' }, { value: 734.75, time: '10:00', date: 'Jan 25' }
  ]
};

const collections = [
  {
    id: 1,
    name: 'Plush Pepe',
    priceTON: '4280.2',
    priceUSDT: '12412.6',
    change: '-20.2%',
    mcap: '24.3M',
    icon: 'https://cdn.changes.tg/gifts/originals/5936013938331222567/Original.png',
    isNegative: true
  },
  {
    id: 2,
    name: "Durov's Cap",
    priceTON: '4.2',
    priceUSDT: '20.7',
    change: '+0.4%',
    mcap: '1.8M',
    icon: 'https://cdn.changes.tg/gifts/originals/5915521180483191380/Original.png',
    isNegative: false
  },
  {
    id: 3,
    name: 'Lol Pop',
    priceTON: '2.3',
    priceUSDT: '18.8',
    change: '+23.3%',
    mcap: '340.2M',
    icon: 'https://cdn.changes.tg/gifts/originals/5170594532177215681/Original.png',
    isNegative: false
  },
  {
    id: 4,
    name: 'Homemade Cake',
    priceTON: '42.2',
    priceUSDT: '612.6',
    change: '+23.2%',
    mcap: '2.1M',
    icon: '🍰',
    isImage: false,
    color: 'bg-orange-500',
    isNegative: false
  },
  {
    id: 5,
    name: 'Nail Bracelet',
    priceTON: '520.3',
    priceUSDT: '1000.9',
    change: '+23.2%',
    mcap: '340K',
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
            Floor: {activeCurrency === 'TON' 
              ? `${data.floor_price.toFixed(2)} TON` 
              : `$${(data.floor_price * currentTonPrice).toFixed(2)}`
            }
          </p>
          <p className="text-gray-800 font-bold text-sm">
            Median: {activeCurrency === 'TON' 
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
        <div className="flex items-center justify-between mb-1">
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
              <div className="text-sm text-gray-500">Market Cap</div>
            </div>
          </div>
          
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-4xl leading-none p-4">×</button>
        </div>

        {/* Price Display Section */}
        <div className="px-6 mb-1 relative">
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
          <div className="mb-2 text-left" style={{ marginLeft: '-10px' }}>
            <div className="flex items-center gap-2 ">
              <div className="flex items-baseline rounded-lg px-2 py-1">
                <span className="text-green-500 text-sm mr-1 flex items-center">▲</span>
                {activeCurrency === 'USDT' && (
                  <span className="text-xl font-mono font-bold text-green-500 tracking-wide mr-1">$</span>
                )}
                <span className="text-xl font-mono font-bold text-green-500 tracking-wide">
                  {activeCurrency === 'TON' 
                    ? collection?.priceTON 
                    : collection?.priceUSDT
                  }
                </span>
                {activeCurrency === 'TON' && (
                  <span className="text-sm text-gray-500 ml-1" style={{ transform: 'translateY(-1.2px)' }}>
                    TON
                  </span>
                )}
              </div>
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
                className="w-20 h-auto opacity-20"
                style={{
                  filter: 'grayscale(1) brightness(0.8)'
                }}
              />
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="floorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6"/>
                    <stop offset="50%" stopColor="#60a5fa"/>
                    <stop offset="100%" stopColor="#93c5fd"/>
                  </linearGradient>
                  <linearGradient id="medianGradient" x1="0" y1="0" x2="1" y2="0">
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
                {/* Floor Price Line */}
                <Line
                  type="monotone"
                  dataKey={activeCurrency === 'TON' ? 'floor_price' : (entry) => entry.floor_price * currentTonPrice}
                  stroke="url(#floorGradient)"
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
                {/* Median Price Line */}
                <Line
                  type="monotone"
                  dataKey={activeCurrency === 'TON' ? 'median_price' : (entry) => entry.median_price * currentTonPrice}
                  stroke="url(#medianGradient)"
                  strokeWidth={3}
                  dot={false}
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
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-3 px-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-600">Floor Price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">Median Price</span>
            </div>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-3 grid-rows-2 gap-x-6 gap-y-2 mt-2 items-center px-6">
          <div>
            <div className="text-xs text-gray-500">Purchases</div>
            <div className="font-bold text-sm text-gray-800">{Math.floor(Math.random() * 1000) + 500}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Volume</div>
            <div className="font-bold text-sm text-gray-800">
              {activeCurrency === 'TON' 
                ? `${(Math.random() * 5000 + 1000).toFixed(0)} TON`
                : `$${(Math.random() * 15000 + 3000).toFixed(0)}`
              }
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Total Supply</div>
            <div className="font-bold text-sm text-gray-800">{Math.floor(Math.random() * 15000) + 2000}/{Math.floor(Math.random() * 10000) + 20000}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Floor Price</div>
            <div className="font-bold text-sm text-gray-800">
              {activeCurrency === 'TON' 
                ? `${(parseFloat(collection?.priceTON) * 0.8)?.toFixed(2)} TON`
                : `$${(parseFloat(collection?.priceUSDT) * 0.8)?.toFixed(2)}`
              }
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 whitespace-nowrap">Median Price</div>
            <div className="font-bold text-sm text-gray-800">
              {activeCurrency === 'TON' 
                ? `${collection?.priceTON} TON`
                : `$${collection?.priceUSDT}`
              }
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Market Cap</div>
            <div className="font-bold text-sm text-gray-800">{collection?.mcap}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MarketPage = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('All');
  const [activeTab, setActiveTab] = useState('Market Cap');
  const [activeCurrency, setActiveCurrency] = useState('TON');
  const [activeFilter, setActiveFilter] = useState('FLOOR');
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const navigate = useNavigate();

  // Get unique dates from chart data
  const uniqueDates = [...new Set(token.chartData.map(item => item.date))];

  // Function to format price values
  const formatPrice = (value) => {
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'k';
    }
    return value.toFixed(1);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const timeData = payload[0]?.payload?.time;
      const dateData = payload[0]?.payload?.date;
      const value = payload[0]?.value;
      
      return (
        <div className="bg-white px-3 py-2 border border-gray-200 rounded shadow-lg">
          {timeData && dateData && (
            <p className="text-gray-600 font-medium text-xs mb-1">
              {`${dateData} ${timeData}`}
            </p>
          )}
          <p className="text-green-600 font-medium text-sm">
            {`Price: ${activeCurrency === 'TON' ? (value + 4000).toFixed(1) : ((value + 4000) * 3).toFixed(1)} ${activeCurrency === 'TON' ? 'TON' : '$'}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Функция для получения данных графика конкретной коллекции
  const getChartDataForCollection = (collection) => {
    if (!collection) return [];
    
    // Генерируем моковые данные для графика коллекции с floor и median price
    const days = 7;
    const basePrice = parseFloat(collection.priceTON) || 1;
    const chartData = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      
      const variation = (Math.random() - 0.5) * 0.2; // ±10% вариация
      const medianPrice = basePrice * (1 + variation);
      const floorPrice = medianPrice * (0.7 + Math.random() * 0.2); // floor 70-90% от median
      
      chartData.push({
        dt: date.toISOString(),
        median_price: medianPrice,
        floor_price: floorPrice
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
            <div className="absolute top-4 right-2 flex bg-gray-100 rounded-lg p-1 z-20">
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
                className={`flex items-center  justify-center w-8 h-6 rounded transition-all duration-200 ${
                  activeCurrency === 'USDT'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaDollarSign className="w-3 h-3" />
              </button>
            </div>

            {/* Price Display */}
            <div className="mb-3 text-left" style={{ marginLeft: '-15.5px' }}>
              <div className="flex items-center gap-2 ">
                <div className="flex items-baseline rounded-lg px-2 py-1">
                  <span className="text-green-500 text-sm mr-1 flex items-center">▲</span>
                  {activeCurrency === 'USDT' && (
                    <span className="text-xl font-mono font-bold text-green-500 tracking-wide mr-1">$</span>
                  )}
                  <span className="text-xl font-mono font-bold text-green-500 tracking-wide">
                    {activeCurrency === 'TON' 
                      ? token.currentPriceTON 
                      : token.currentPriceUSDT
                    }
                  </span>
                  {activeCurrency === 'TON' && (
                    <span className="text-sm text-gray-500 ml-1" style={{ transform: 'translateY(-1.2px)' }}>
                      TON
                    </span>
                  )}
                </div>
                <span className="text-green-500 bg-green-100 rounded-lg px-2 py-1 font-medium text-xs">{token.price}</span>
              </div>
              <div className="text-gray-500 text-sm">{token.timeframe}</div>
            </div>

            {/* Chart */}
            <div className="w-full h-44 mb-3 relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={token.chartData} margin={{ left: 20, right: 22 }}>
                  <XAxis hide />
                  <YAxis 
                    hide 
                    domain={activeCurrency === 'TON' ? [4043.7, 4734.8] : [12131.1, 14204.3]}
                    type="number"
                  />
                  <CartesianGrid 
                    horizontal={true} 
                    vertical={false} 
                    stroke="#e5e7eb" 
                    strokeWidth={0.5}
                    strokeOpacity={0.8}
                    horizontalCoordinatesGenerator={(props) => {
                      const { height } = props;
                      const values = activeCurrency === 'TON' 
                        ? [4043.7, 4274.0, 4504.4, 4734.8]
                        : [12131.1, 12822.0, 13513.2, 14204.3];
                      const min = activeCurrency === 'TON' ? 4043.7 : 12131.1;
                      const max = activeCurrency === 'TON' ? 4734.8 : 14204.3;
                      return values.map(value => {
                        const percentage = (value - min) / (max - min);
                        return height - (height * percentage);
                      });
                    }}
                  />
                  <Tooltip 
                    content={<CustomTooltip />} 
                    animationDuration={150}
                  />
                  <Line
                    type="monotone"
                    dataKey={activeCurrency === 'TON' ? (entry) => entry.value + 4000 : (entry) => (entry.value + 4000) * 3}
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              {/* Price markers (выровнены по линиям CartesianGrid) */}
              {(() => {
                // Значения и домены для текущей валюты
                const values = activeCurrency === 'TON'
                  ? [4043.7, 4274.0, 4504.4, 4734.8]
                  : [12131.1, 12822.0, 13513.2, 14204.3];
                const min = activeCurrency === 'TON' ? 4043.7 : 12131.1;
                const max = activeCurrency === 'TON' ? 4734.8 : 14204.3;
                return (
                  <div
                    className="absolute text-xs text-gray-400 z-10 pointer-events-none flex flex-col h-full"
                    style={{
                      left: '-13.5px',
                      top: '6px',
                      paddingLeft: '0.5rem'
                    }}
                  >
                    {values.map((value, idx) => {
                      const percentage = (value - min) / (max - min);
                      // Высота контейнера графика 192px (h-48)
                      const top = 192 - (192 * percentage) - 8; // -8px чтобы текст был по центру линии
                      return (
                        <div
                          key={value}
                          className="font-mono absolute"
                          style={{
                            top: `${top}px`,
                            left: 0,
                            transform: 'translateY(-50%)'
                          }}
                        >
                          {formatPrice(value)}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Date markers (bottom) - added above timeframes */}
            <div className="flex justify-between text-xs text-gray-400 px-6 mb-3 mt-2">
              {uniqueDates.filter((_, index) => index % 4 === 0).map((date, index) => (
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
                  } else if (tab === 'Volume') {
                    navigate('/volume');
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
                activeFilter === 'FLOOR' ? 'bg-blue-500' : 'bg-gray-300'
              }`} />
              <button
                onClick={() => setActiveFilter('FLOOR')}
                className={`text-xs font-medium transition-colors ${
                  activeFilter === 'FLOOR' ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                FLOOR
              </button>
              <div className={`w-1 h-1 rounded-full ${
                activeFilter === 'MARKET' ? 'bg-blue-500' : 'bg-gray-300'
              }`} />
              <button
                onClick={() => setActiveFilter('MARKET')}
                className={`text-xs font-medium transition-colors ${
                  activeFilter === 'MARKET' ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                MARKET
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
                  <div className="text-sm text-gray-500">Mcap • {collection.mcap}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  {activeCurrency === 'TON' ? collection.priceTON : collection.priceUSDT}
                  {activeCurrency === 'TON' ? ' TON' : '$'}
                </div>
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

export default MarketPage;