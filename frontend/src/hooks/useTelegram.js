import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://durov.online/api';

// Функция ожидания загрузки Telegram WebApp
const waitForTelegram = (timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkTelegram = () => {
      if (window.Telegram?.WebApp) {
        console.log('✅ Telegram WebApp loaded');
        resolve(window.Telegram.WebApp);
        return;
      }
      
      if (Date.now() - startTime > timeout) {
        reject(new Error('Telegram WebApp loading timeout'));
        return;
      }
      
      setTimeout(checkTelegram, 100);
    };
    
    checkTelegram();
  });
};

export const useTelegram = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);

  const initializeTelegram = useCallback(async () => {
    try {
      setIsInitializing(true);
      setError(null);

      console.log('🔄 Waiting for Telegram WebApp to load...');
      
      // Ожидаем загрузки Telegram WebApp
      const tg = await waitForTelegram();
      
      console.log('✅ Telegram WebApp available');

      // Ждем дополнительно для полной инициализации
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Получаем initData от Telegram
      let initData = tg.initData;
      
      // Если initData пустая, пробуем получить из initDataUnsafe
      if (!initData && tg.initDataUnsafe) {
        console.log('📝 Using initDataUnsafe as fallback');
        initData = JSON.stringify(tg.initDataUnsafe);
      }
      
      if (!initData) {
        throw new Error('No init data from Telegram WebApp');
      }

      console.log('🔍 Initializing with Telegram data...');

      // Отправляем initData на auth-service для валидации
      const authResponse = await fetch(`${API_BASE_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          init_data: typeof initData === 'string' ? initData : JSON.stringify(initData)
        })
      });

      const authData = await authResponse.json();

      if (!authResponse.ok || !authData.success) {
        console.error('❌ Auth failed:', authData);
        throw new Error(authData.error || 'Authentication failed');
      }

      console.log('✅ Auth successful:', authData.user);

      // Устанавливаем данные пользователя
      setUser(authData.user);
      setIsAuthenticated(true);

      // Настраиваем Telegram WebApp
      tg.ready();
      tg.expand();
      
    } catch (err) {
      console.error('❌ Telegram initialization failed:', err);
      setError(err.message);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    initializeTelegram();
  }, [initializeTelegram]);

  const getUsername = useCallback(() => {
    const username = user?.username || '';
    // Фильтруем автоматически сгенерированные username
    if (username.startsWith('user_') && /^user_\d+$/.test(username)) {
      return '';
    }
    return username;
  }, [user]);

  const getUserPhoto = useCallback(() => {
    return user?.photo_url || '';
  }, [user]);

  const getUserId = useCallback(() => {
    return user?.id || '';
  }, [user]);

  const getInitData = useCallback(async () => {
    try {
      const tg = await waitForTelegram(5000);
      const initData = tg.initData;
      return typeof initData === 'string' ? initData : JSON.stringify(initData);
    } catch (err) {
      console.error('Failed to get init data:', err);
      return '';
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isInitializing,
    error,
    getUsername,
    getUserPhoto,
    getUserId,
    getInitData,
    reinitialize: initializeTelegram
  };
};
