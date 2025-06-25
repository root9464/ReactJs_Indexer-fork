// Утилита для записи метрик пользователей

let sessionId = null;

// Генерируем уникальный ID сессии
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Получаем или создаем ID сессии
const getSessionId = () => {
  if (!sessionId) {
    sessionId = sessionStorage.getItem('app_session_id');
    if (!sessionId) {
      sessionId = generateSessionId();
      sessionStorage.setItem('app_session_id', sessionId);
    }
  }
  return sessionId;
};

// Основная функция для записи метрики
export const recordMetric = async (eventType, eventData = {}, page = 'unknown') => {
  try {
    // Получаем информацию о пользователе из контекста Telegram
    const tg = window.Telegram?.WebApp;
    if (!tg?.initDataUnsafe?.user?.id) {
      console.warn('📊 No Telegram user data available for metrics');
      return false;
    }

    // Валидируем обязательные поля
    if (!eventType || typeof eventType !== 'string') {
      console.warn('📊 Invalid event type for metrics:', eventType);
      return false;
    }

    const metric = {
      user_id: parseInt(tg.initDataUnsafe.user.id), // Убеждаемся что это число
      event_type: eventType.trim(),
      event_data: eventData || {},
      page: page || window.location.pathname,
      session_id: getSessionId(),
      user_agent: navigator.userAgent,
    };

    console.log('📊 Sending metric:', { 
      eventType: metric.event_type, 
      page: metric.page, 
      userId: metric.user_id 
    });

    // Получаем initData для авторизации
    const initData = tg.initData;
    if (!initData) {
      console.warn('📊 No Telegram initData available for metrics authorization');
      return false;
    }

    // Отправляем метрику на backend с авторизацией
    const response = await fetch('/api/metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-Init-Data': initData,
      },
      body: JSON.stringify(metric),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('📊 Failed to record metric:', response.status, response.statusText, errorText);
      return false;
    }

    const result = await response.json();
    console.log('✅ Metric recorded successfully:', eventType, result);
    return true;
  } catch (error) {
    console.warn('📊 Error recording metric:', error);
    return false;
  }
};

// Специализированные функции для разных типов событий
export const trackPopupOpen = (popupType, additionalData = {}) => {
  return recordMetric('popup_open', {
    popup_type: popupType,
    ...additionalData
  }, window.location.pathname);
};

export const trackPageView = (pageName, additionalData = {}) => {
  return recordMetric('page_view', {
    page_name: pageName,
    ...additionalData
  }, pageName); // Передаем pageName как параметр page
};

export const trackGiftClick = (giftId, giftData = {}) => {
  return recordMetric('gift_click', {
    gift_id: giftId,
    ...giftData
  }, window.location.pathname);
};

export const trackButtonClick = (buttonName, additionalData = {}) => {
  return recordMetric('button_click', {
    button_name: buttonName,
    ...additionalData
  }, window.location.pathname);
};

// Добавляем специализированную функцию для портфолио
export const trackPortfolioPageView = (portfolioData, username, userId) => {
  const uniqueGifts = portfolioData?.results ? 
    Object.values(portfolioData.results.reduce((acc, item) => {
      if (item?.gift_id) {
        const existing = acc[item.gift_id];
        if (!existing || new Date(item.dt) > new Date(existing.dt)) {
          acc[item.gift_id] = item;
        }
      }
      return acc;
    }, {})) : [];

  const totalValue = uniqueGifts.reduce((sum, gift) => sum + (gift?.median_price || 0), 0);

  return recordMetric('page_view', {
    page_name: 'portfolio',
    user_id: userId,
    username: username,
    has_gifts: uniqueGifts.length > 0,
    total_gifts: uniqueGifts.length,
    total_value: totalValue
  }, 'portfolio');
};

// Добавляем функцию для отслеживания просмотра страницы исследования
export const trackExplorePageView = (portfolioData, username, userId) => {
  return recordMetric('page_view', {
    page_name: 'explore',
    user_id: userId,
    username: username,
    has_gifts: portfolioData.length > 0,
    total_gifts: portfolioData.reduce((sum, item) => sum + (item.gifts || 0), 0),
    total_value: portfolioData.reduce((sum, item) => sum + (item.price || 0), 0)
  }, 'explore');
};
