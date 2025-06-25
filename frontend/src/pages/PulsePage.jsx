import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';
import { FaFire, FaDollarSign, FaArrowUp } from 'react-icons/fa';
import GiftIndexLogo from '../assets/Giftindex_logo.svg';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid
} from 'recharts';

// Компонент для горячих подарков
const HotGiftCard = ({ gift, onBuy }) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-3">
          <span className="text-2xl">{gift.icon}</span>
        </div>
        <div>
          <div className="font-bold text-gray-800">{gift.name}</div>
          <div className="text-sm text-gray-500">{gift.change}</div>
        </div>
      </div>
      <div className="text-green-500 bg-green-100 rounded-xl px-2 py-1 text-xs font-bold">
        {gift.percentage}
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div className="text-right">
        <div className="text-base text-gray-800">{gift.price}</div>
        <div className="text-sm text-gray-500">{gift.volume}</div>
      </div>
      <button 
        onClick={() => onBuy(gift)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl transition-colors"
      >
        BUY
      </button>
    </div>
  </div>
);

// Компонент для трендовых подарков
const TrendGiftCard = ({ gift }) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mr-3">
          <span className="text-2xl">{gift.icon}</span>
        </div>
        <div>
          <div className="font-bold text-gray-800">{gift.name}</div>
          <div className="text-sm text-gray-500">{gift.deals} Deals</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-base text-gray-800">{gift.price}</div>
        <div className="text-sm text-gray-500">{gift.volume}</div>
      </div>
    </div>
  </div>
);

// Компонент для моделей
const ModelCard = ({ model, onBuy }) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
          <span className="text-2xl">{model.icon}</span>
        </div>
        <div>
          <div className="font-bold text-gray-800">{model.name}</div>
          <div className="text-sm text-gray-500">{model.trades} Trades {model.change}</div>
        </div>
      </div>
      <button 
        onClick={() => onBuy(model)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl transition-colors"
      >
        BUY
      </button>
    </div>
    <div className="text-right">
      <div className="text-lg font-bold text-gray-800">{model.price}</div>
      <div className="text-sm text-gray-500">{model.volume}</div>
    </div>
  </div>
);

// Новый компонент для карточки коллекции в стиле ExplorePage
const CollectionCard = ({ item, onBuy, section }) => (
  <div 
    className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
    onClick={() => console.log('Clicked:', item)}
  >
    <div className="flex items-center">
      <div className="w-10 h-10 flex items-center justify-center mr-3 overflow-hidden">
        <span className="text-lg">{item.icon}</span>
      </div>
      <div>
        <div className="font-medium text-gray-900">{item.name}</div>
        <div className="text-sm text-gray-500">
          {section === 'trends' ? `${item.deals} Deals` : 
           section === 'hot' ? item.change :
           `${item.trades} Trades ${item.change}`}
        </div>
      </div>
    </div>
    <div className="text-right">
      {section === 'models' ? (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onBuy(item);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-lg transition-colors text-sm"
        >
          BUY
        </button>
      ) : (
        <div>
          <div className="font-medium text-gray-900">{item.price}</div>
          <div className="text-sm text-gray-500">{item.volume || item.percentage}</div>
        </div>
      )}
    </div>
  </div>
);

// Компонент иконки TON
const TonIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className}>
    <path fill="#08C" d="M19.011 9.201L12.66 19.316a.857.857 0 0 1-1.453-.005L4.98 9.197a1.8 1.8 0 0 1-.266-.943a1.856 1.856 0 0 1 1.881-1.826h10.817c1.033 0 1.873.815 1.873 1.822c0 .334-.094.664-.274.951M6.51 8.863l4.632 7.144V8.143H6.994c-.48 0-.694.317-.484.72m6.347 7.144l4.633-7.144c.214-.403-.005-.72-.485-.72h-4.148z"/>
  </svg>
);

// Добавляем компонент попапа из GainersPage
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
              <span className="text-2xl">{collection?.icon}</span>
            </div>
            <div className="flex-1">
              <div className="font-bold text-base text-gray-800">{collection?.name}</div>
              <div className="text-sm text-gray-500">Pulse</div>
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
          <div className="text-left">
            <div className="flex items-center gap-2 -ml-3">
              <div className="flex items-baseline rounded-lg px-2 py-1">
                <span className="text-green-500 text-sm mr-1 flex items-center">▲</span>
                {activeCurrency === 'USDT' && (
                  <span className="text-xl font-mono font-bold text-green-500 tracking-wide mr-1">$</span>
                )}
                <span className="text-xl font-mono font-bold text-green-500 tracking-wide">
                  {activeCurrency === 'TON' 
                    ? (parseFloat(collection?.price?.replace('TON', '') || '0') || 1).toFixed(2)
                    : ((parseFloat(collection?.price?.replace('TON', '') || '0') || 1) * currentTonPrice).toFixed(2)
                  }
                </span>
                {activeCurrency === 'TON' && (
                  <span className="text-sm text-gray-500 ml-1" style={{ transform: 'translateY(-1.2px)' }}>
                    TON
                  </span>
                )}
              </div>
              <span className="text-green-500 bg-green-100 rounded-lg px-2 py-1 font-medium text-xs">
                {collection?.percentage || '+0.0%'}
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
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-3 grid-rows-2 gap-x-6 gap-y-2 mt-2 items-center px-6">
          <div>
            <div className="text-xs text-gray-500">Changes</div>
            <div className="font-bold text-sm text-gray-800">
              {collection?.change || collection?.percentage || '+0.0%'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Floor Price</div>
            <div className="font-bold text-sm text-gray-800">
              {activeCurrency === 'TON' 
                ? `${((parseFloat(collection?.price?.replace('TON', '') || '0') || 1) * 0.8).toFixed(1)} TON`
                : `$${(((parseFloat(collection?.price?.replace('TON', '') || '0') || 1) * 0.8) * currentTonPrice).toFixed(1)}`
              }
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Market Price</div>
            <div className="font-bold text-sm text-gray-800">
              {activeCurrency === 'TON' 
                ? `${((parseFloat(collection?.price?.replace('TON', '') || '0') || 1) * 1.2).toFixed(1)} TON`
                : `$${(((parseFloat(collection?.price?.replace('TON', '') || '0') || 1) * 1.2) * currentTonPrice).toFixed(1)}`
              }
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Volume</div>
            <div className="font-bold text-sm text-gray-800">
              {collection?.volume || '1.2K TON'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Purchase</div>
            <div className="font-bold text-sm text-gray-800">
              {collection?.trades || collection?.deals || '342'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Market Cap</div>
            <div className="font-bold text-sm text-gray-800">
              {activeCurrency === 'TON' 
                ? `${((parseFloat(collection?.price?.replace('TON', '') || '0') || 1) * 2.5).toFixed(1)}K TON`
                : `$${(((parseFloat(collection?.price?.replace('TON', '') || '0') || 1) * 2.5) * currentTonPrice).toFixed(1)}K`
              }
            </div>
          </div>
        </div>

        {/* Buy Button */}
        <div className="px-6 mt-6">
          <button 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-colors"
            onClick={() => console.log('Buy on Tonnel')}
          >
            Buy on Tonnel
          </button>
        </div>
      </div>
    </div>
  );
};

const PulsePage = () => {
  const { user, getUsername, getUserPhoto } = useTelegram();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');
  const [activeFilter, setActiveFilter] = useState('TRENDS');
  const [tonPrice] = useState(3.0);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [currentTrendIndex, setCurrentTrendIndex] = useState(0);
  const [currentHotIndex, setCurrentHotIndex] = useState(0);
  const [isAnimatingTrend, setIsAnimatingTrend] = useState(false);
  const [isAnimatingHot, setIsAnimatingHot] = useState(false);

  // Расширенные данные для TRENDS (3 варианта)
  const trendsData = [
    {
      id: 'trend_1',
      name: 'Candy Pink',
      icon: '🍭',
      price: '4232 TON',
      volume: 'Volume',
      deals: '342',
      percentage: '+1.3%',
      section: 'trends'
    },
    {
      id: 'trend_2',
      name: 'Dragon Gold',
      icon: '🐉',
      price: '5847 TON',
      volume: 'Volume',
      deals: '156',
      percentage: '+2.1%',
      section: 'trends'
    },
    {
      id: 'trend_3',
      name: 'Mystic Rose',
      icon: '🌹',
      price: '3921 TON',
      volume: 'Volume',
      deals: '278',
      percentage: '+1.8%',
      section: 'trends'
    }
  ];

  // Расширенные данные для HOT (3 варианта)
  const hotData = [
    {
      id: 'hot_1',
      name: 'Faberge',
      icon: '🥚',
      price: '$804.20',
      volume: '267 TON',
      change: '+152.02%',
      percentage: '+1.2%',
      section: 'hot'
    },
    {
      id: 'hot_2',
      name: 'Crystal Moon',
      icon: '🌙',
      price: '$1,245.80',
      volume: '189 TON',
      change: '+98.47%',
      percentage: '+2.5%',
      section: 'hot'
    },
    {
      id: 'hot_3',
      name: 'Fire Phoenix',
      icon: '🔥',
      price: '$679.35',
      volume: '421 TON',
      change: '+203.89%',
      percentage: '+3.1%',
      section: 'hot'
    }
  ];

  // Объединенные данные для всех секций в едином формате
  const allData = [
    // MODELS остаются статичными
    {
      id: 'model_1',
      name: 'Brand Name',
      icon: '🔧',
      price: '156.5 TON',
      trades: '342',
      change: '+3.56%',
      percentage: '+3.56%',
      section: 'models'
    },
    {
      id: 'model_2',
      name: 'Pumpkin',
      icon: '🎃',
      price: '89.3 TON',
      trades: '256',
      change: '+1.19%',
      percentage: '+1.19%',
      section: 'models'
    },
    {
      id: 'model_3',
      name: 'Majestic',
      icon: '💎',
      price: '234.7 TON',
      trades: '84',
      change: '+1.05%',
      percentage: '+1.05%',
      section: 'models'
    },
    {
      id: 'model_4',
      name: 'Uranium',
      icon: '☢️',
      price: '45.2 TON',
      trades: '98',
      change: '+0.94%',
      percentage: '+0.94%',
      section: 'models'
    },
    {
      id: 'model_5',
      name: 'Arcade',
      icon: '🎮',
      price: '178.9 TON',
      trades: '163',
      change: '+0.83%',
      percentage: '+0.83%',
      section: 'models'
    }
  ];

  useEffect(() => {
    // Симуляция загрузки данных
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Автоматическая смена NFT каждые 5 секунд с анимацией
  useEffect(() => {
    const interval = setInterval(() => {
      // Анимация для TRENDS
      setIsAnimatingTrend(true);
      setTimeout(() => {
        setCurrentTrendIndex((prev) => (prev + 1) % trendsData.length);
        setIsAnimatingTrend(false);
      }, 250);

      // Анимация для HOT с небольшой задержкой
      setTimeout(() => {
        setIsAnimatingHot(true);
        setTimeout(() => {
          setCurrentHotIndex((prev) => (prev + 1) % hotData.length);
          setIsAnimatingHot(false);
        }, 250);
      }, 100);
    }, 5000);

    return () => clearInterval(interval);
  }, [trendsData.length, hotData.length]);

  const handleBuy = (item) => {
    console.log('Покупка:', item);
    // Здесь будет логика покупки
  };

  // Функция для получения данных графика конкретной коллекции
  const getChartDataForCollection = (collection) => {
    if (!collection) return [];
    
    // Генерируем моковые данные для графика коллекции с median_price
    const days = 7;
    const basePrice = parseFloat(collection.price?.replace('TON', '') || collection.price?.replace('%', '') || '1') || 1;
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

  const tabs = [
    { id: 'today', label: 'Today', active: true },
    { id: 'week', label: 'Week', active: false },
    { id: 'month', label: 'Month', active: false },
    { id: '4hours', label: '4 Hours', active: false }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const sections = [
    { id: 'trends', label: 'TRENDS', icon: <FaArrowUp /> },
    { id: 'hot', label: 'HOT', icon: <FaFire /> },
    { id: 'models', label: 'MODELS' }
  ];

  if (loading) {
    return (
      <div className="relative min-h-screen bg-white">
        <div className="overflow-y-auto pb-20 px-4 pt-2">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      <div className="overflow-y-auto pb-20 px-4 pt-2">
        {/* User Info Header */}
        <div className="flex justify-center py-2">
          <div className="inline-flex items-center border border-gray-300 rounded-2xl px-3 py-2 bg-white shadow-sm">
            {getUserPhoto() ? (
              <img 
                src={getUserPhoto()} 
                alt="User avatar"
                className="w-5 h-5 rounded-full mr-2 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : (
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs font-bold">
                  {user?.first_name?.[0] || 'T'}
                </span>
              </div>
            )}
            <div className="w-5 h-5 bg-blue-500 rounded-full items-center justify-center mr-2 hidden">
              <span className="text-white text-xs font-bold">
                {user?.first_name?.[0] || 'T'}
              </span>
            </div>
            <span className="text-gray-700 font-bold text-sm">@{getUsername() || 'user'} • 53212 TON • </span>
            <span className="text-orange-500 font-bold text-sm">🎁 34</span>
          </div>
        </div>

        {/* Time Period Tabs */}
        <div className="flex mb-4 gap-2 justify-between">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`py-2 px-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex-1 text-center ${
                activeTab === tab.id
                  ? 'text-blue-500 border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-blue-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TRENDS Section */}
        <div className="mb-4">
          <div className="text-gray-500 text-xs font-medium mb-2 px-3">TRENDS</div>
          <div 
            className={`bg-white rounded-2xl p-4 mb-3 mx-1 transition-all duration-500 ease-in-out transform ${
              isAnimatingTrend 
                ? 'translate-y-4 opacity-0' 
                : 'translate-y-0 opacity-100'
            }`}
            style={{
              border: '1px solid transparent',
              backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #ef4444, #f59e0b, #1d4ed8)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mr-3 transition-all duration-300 ${
                  isAnimatingTrend ? 'scale-95' : 'scale-100'
                }`}>
                  <span className="text-2xl">{trendsData[currentTrendIndex].icon}</span>
                </div>
                <div>
                  <div className={`text-gray-800 transition-all duration-300 ${
                    isAnimatingTrend ? 'opacity-70' : 'opacity-100'
                  }`}>
                    {trendsData[currentTrendIndex].name} • {trendsData[currentTrendIndex].percentage.replace('+', '')}
                  </div>
                  <div className={`text-sm text-gray-500 transition-all duration-300 ${
                    isAnimatingTrend ? 'opacity-70' : 'opacity-100'
                  }`}>
                    {trendsData[currentTrendIndex].deals} Deals
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-base text-gray-800 transition-all duration-300 ${
                  isAnimatingTrend ? 'opacity-70' : 'opacity-100'
                }`}>
                  {trendsData[currentTrendIndex].price}
                </div>
                <div className="text-sm text-green-500">Volume</div>
              </div>
            </div>
          </div>
        </div>

        {/* HOT Section */}
        <div className="mb-4">
          <div className="text-gray-500 text-xs font-medium mb-2 px-3">HOT</div>
          <div 
            className={`bg-white rounded-2xl p-4 mb-3 mx-1 transition-all duration-500 ease-in-out transform ${
              isAnimatingHot 
                ? 'translate-y-4 opacity-0' 
                : 'translate-y-0 opacity-100'
            }`}
            style={{
              border: '1px solid transparent',
              backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #ef4444, #f59e0b, #1d4ed8)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-3 transition-all duration-300 ${
                  isAnimatingHot ? 'scale-95' : 'scale-100'
                }`}>
                  <span className="text-2xl">{hotData[currentHotIndex].icon}</span>
                </div>
                <div>
                  <div className={`text-gray-800 transition-all duration-300 ${
                    isAnimatingHot ? 'opacity-70' : 'opacity-100'
                  }`}>
                    {hotData[currentHotIndex].name} • {hotData[currentHotIndex].percentage.replace('+', '')}
                  </div>
                  <div className={`text-sm text-green-500 transition-all duration-300 ${
                    isAnimatingHot ? 'opacity-70' : 'opacity-100'
                  }`}>
                    {hotData[currentHotIndex].change}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-base text-gray-800 transition-all duration-300 ${
                  isAnimatingHot ? 'opacity-70' : 'opacity-100'
                }`}>
                  {hotData[currentHotIndex].price}
                </div>
                <div className={`text-sm text-green-500 transition-all duration-300 ${
                  isAnimatingHot ? 'opacity-70' : 'opacity-100'
                }`}>
                  {hotData[currentHotIndex].volume}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODELS Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-3">
            <div className="text-gray-500 text-xs font-medium">MODELS</div>
            <div className="flex items-center gap-2">
              <div className={`w-1 h-1 rounded-full ${
                activeFilter === 'HOT' ? 'bg-blue-500' : 'bg-gray-300'
              }`} />
              <button
                onClick={() => setActiveFilter('HOT')}
                className={`text-xs font-medium transition-colors ${
                  activeFilter === 'HOT' ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                HOT
              </button>
              <div className={`w-1 h-1 rounded-full ${
                activeFilter === 'TRENDS' ? 'bg-blue-500' : 'bg-gray-300'
              }`} />
              <button
                onClick={() => setActiveFilter('TRENDS')}
                className={`text-xs font-medium transition-colors ${
                  activeFilter === 'TRENDS' ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                TRENDS
              </button>
            </div>
          </div>
          <div className="space-y-1 px-4">
            {allData.filter(item => item.section === 'models').map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => {
                  setSelectedCollection(item);
                  setPopupOpen(true);
                }}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center mr-3 overflow-hidden">
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      {item.trades} Trades
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{item.price}</div>
                  <div className={`text-sm ${item.percentage.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {item.percentage}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Popup with chart */}
      <PopupCollectionChart
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        collection={selectedCollection}
        chartData={selectedCollection ? getChartDataForCollection(selectedCollection) : []}
        currentTonPrice={tonPrice}
      />
    </div>
  );
};

export default PulsePage;
