import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid
} from 'recharts';

const PopupGiftChart = ({ open, onClose, gift, chartData, backdrops, currentTonPrice }) => {
  if (!open || !gift) return null;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-2 py-1 border border-gray-200 rounded shadow-lg">
          <p className="text-gray-800 font-medium">{`${payload[0].value.toFixed(2)} TON`}</p>
        </div>
      );
    }
    return null;
  };

  const getBackdropByName = (backdropName) => {
    if (!backdropName || !backdrops.length) {
      return {
        name: "Default",
        hex: {
          centerColor: "#363738",
          edgeColor: "#0e0f0f"
        }
      };
    }
    
    const backdrop = backdrops.find(b => b.name === backdropName);
    return backdrop || {
      name: "Default", 
      hex: {
        centerColor: "#363738",
        edgeColor: "#0e0f0f"
      }
    };
  };

  const backdrop = getBackdropByName(gift.backdrop_value);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle at 60% 40%, ${backdrop?.hex?.centerColor || '#363738'} 60%, ${backdrop?.hex?.edgeColor || '#0e0f0f'} 100%)`
              }}
            >
              <img
                src={gift.png}
                alt={gift.model_value}
                className="w-8 h-8"
              />
            </div>
            <div>
              <h2 className="font-bold text-lg">{gift.collection}</h2>
              <p className="text-gray-500 text-sm">#{gift.gift_num}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Price Info */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">{gift.median_price?.toFixed(2)} TON</span>
            <span className="text-gray-500">${(gift.median_price * currentTonPrice).toFixed(2)}</span>
          </div>
          <div className="text-sm text-gray-500">
            Current median price
          </div>
        </div>

        {/* Chart */}
        {chartData && chartData.length > 1 && (
          <div className="p-4 border-b">
            <h3 className="font-medium mb-3">Price History</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis 
                    dataKey="dt" 
                    tickFormatter={(value) => {
                      return new Date(value).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      });
                    }}
                    fontSize={12}
                  />
                  <YAxis 
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={(value) => `${value.toFixed(1)}`}
                    fontSize={12}
                  />
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="median_price"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Gift Details */}
        <div className="p-4">
          <div className="space-y-3">
            <div>
              <span className="text-gray-500 text-sm">Collection:</span>
              <p className="font-medium">{gift.collection}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Gift Number:</span>
              <p className="font-medium">#{gift.gift_num}</p>
            </div>
            {gift.backdrop_value && (
              <div>
                <span className="text-gray-500 text-sm">Backdrop:</span>
                <p className="font-medium">{gift.backdrop_value}</p>
              </div>
            )}
            <div>
              <span className="text-gray-500 text-sm">Last Updated:</span>
              <p className="font-medium">
                {new Date(gift.dt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupGiftChart;
