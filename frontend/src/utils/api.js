const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://durov.online/api';

// Функция ожидания загрузки Telegram WebApp
const waitForTelegram = (timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkTelegram = () => {
      if (window.Telegram?.WebApp) {
        resolve(window.Telegram.WebApp);
        return;
      }
      
      if (Date.now() - startTime > timeout) {
        reject(new Error('Telegram WebApp not available'));
        return;
      }
      
      setTimeout(checkTelegram, 100);
    };
    
    checkTelegram();
  });
};

// Мок-данные для разработки вне Telegram WebApp
const DEV_MOCK_USER = {
  id: 99281932,
  first_name: 'Andrew',
  last_name: 'Rogue',
  username: 'rogue',
  language_code: 'en',
  is_premium: true,
  allows_write_to_pm: true,
  photo_url: 'https://t.me/i/userpic/320/rogue.jpg'
};
const DEV_MOCK_INITDATA = 'user=' + encodeURIComponent(JSON.stringify(DEV_MOCK_USER)) +
  '&hash=89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31' +
  '&auth_date=1716922846&start_param=debug&chat_type=sender&chat_instance=8428209589180549439&signature=6fbdaab833d39f54518bd5c3eb3f511d035e68cb';

const isDevMock = () =>
  (typeof window !== 'undefined' && (!window.Telegram || !window.Telegram.WebApp)) &&
  (import.meta?.env?.DEV || process.env.NODE_ENV === 'development');

// Глобальный флаг мок-режима
const isMockApi = () => typeof window !== 'undefined' && window.USE_MOCK_API === true;

// Функция для получения Telegram данных
const getTelegramData = async () => {
  try {
    const tg = await waitForTelegram();
    
    let initData = tg.initData;
    const user = tg.initDataUnsafe?.user;

    // Если initData пустая, используем fallback
    if (!initData && tg.initDataUnsafe) {
      initData = JSON.stringify(tg.initDataUnsafe);
    }

    if (!initData) {
      throw new Error('No init data from Telegram');
    }

    if (isDevMock()) {
      return {
        initData: DEV_MOCK_INITDATA,
        username: DEV_MOCK_USER.username,
        userId: DEV_MOCK_USER.id.toString()
      };
    }

    return {
      initData: typeof initData === 'string' ? initData : JSON.stringify(initData),
      username: user?.username || '',
      userId: user?.id?.toString() || ''
    };
  } catch (error) {
    console.error('Failed to get Telegram data:', error);
    throw new Error('Not running in Telegram WebApp or WebApp not ready');
  }
};

// Функция для отправки запросов к BFF с Telegram заголовками
const apiRequest = async (endpoint, options = {}) => {
  try {
    const telegramData = await getTelegramData();
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'X-Telegram-Init-Data': telegramData.initData,
      'X-Telegram-Username': telegramData.username,
      'X-Telegram-User-ID': telegramData.userId,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const responseData = await response.json();
    
    // 🔍 ОТЛАДКА: Логируем полный ответ от API
    console.log(`🔍 API Response from ${endpoint}:`, {
      endpoint,
      status: response.status,
      dataKeys: Object.keys(responseData),
      resultsCount: responseData.results?.length || 0,
      tonPrice: responseData.ton_price,
      backdropsCount: responseData.backdrops?.length || 0,
      emptyPortfolio: responseData.empty_portfolio,
      emptyReason: responseData.empty_reason,
    });
    
    // 🔍 ОТЛАДКА: Показываем первые несколько записей results
    if (responseData.results?.length > 0) {
      console.log('🔍 First 3 results:', responseData.results.slice(0, 3));
    } else if (responseData.empty_portfolio) {
      console.log('🔍 Empty portfolio detected:', {
        reason: responseData.empty_reason,
        username: responseData.username
      });
    }

    return responseData;
  } catch (error) {
    console.error(`❌ API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Функция для проверки подписки пользователя на канал
export const checkSubscription = async () => {
  if (isMockApi()) {
    // Мок: всегда подписан
    return { subscribed: true, mock: true };
  }
  console.log('🔄 Checking subscription via BFF...');
  return await apiRequest('/check-subscription', {
    method: 'POST',
  });
};

// Функция для обработки подарков пользователя
export const processUserGifts = async () => {
  if (isMockApi()) {
    // Мок-ответ с фейковыми подарками
    return {
      results: [
        {
          gift_id: 1,
          collection: "Candy Pink",
          gift_num: 101,
          median_price: 12.5,
          per_day_change: 2.1,
          model_value: "Candy",
          backdrop_value: "Pink",
          png: "https://cdn.changes.tg/gifts/originals/1/Original.png",
          dt: new Date().toISOString()
        },
        {
          gift_id: 2,
          collection: "Dragon Gold",
          gift_num: 202,
          median_price: 25.7,
          per_day_change: -1.2,
          model_value: "Dragon",
          backdrop_value: "Gold",
          png: "https://cdn.changes.tg/gifts/originals/2/Original.png",
          dt: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      ton_price: 3.0,
      backdrops: [
        { name: "Pink", hex: { centerColor: "#ffb6c1", edgeColor: "#ff69b4" } },
        { name: "Gold", hex: { centerColor: "#ffd700", edgeColor: "#b8860b" } }
      ],
      username: "rogue",
      empty_portfolio: false,
      mock: true
    };
  }
  console.log('🔄 Processing user gifts...');
  try {
    return await apiRequest('/process-gifts', {
      method: 'POST',
    });
  } catch (error) {
    // Если ошибка связана с подпиской, пробрасываем специальный тип
    if (error.message.includes('Subscription required') || 
        error.message.includes('SUBSCRIPTION_REQUIRED') ||
        error.message.includes('is not subscribed')) {
      const subscriptionError = new Error('SUBSCRIPTION_REQUIRED');
      subscriptionError.code = 'SUBSCRIPTION_REQUIRED';
      throw subscriptionError;
    }
    throw error;
  }
};

export default {
  processUserGifts,
  checkSubscription,
};

// Добавляем функцию для отслеживания API запросов
export const trackApiRequest = async (endpoint, requestData = {}) => {
  try {
    const { recordMetric } = await import('./metrics');
    await recordMetric('api_request', {
      endpoint: endpoint,
      ...requestData
    }, window.location.pathname);
  } catch (error) {
    console.warn('Failed to track API request:', error);
  }
};
