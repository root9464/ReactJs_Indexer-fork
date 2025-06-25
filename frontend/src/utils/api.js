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
  console.log('🔄 Checking subscription via BFF...');
  return await apiRequest('/check-subscription', {
    method: 'POST',
  });
};

// Функция для обработки подарков пользователя
export const processUserGifts = async () => {
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
