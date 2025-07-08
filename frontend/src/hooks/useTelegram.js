import { useCallback, useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://durov.online/api';

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

// Мок-данные для разработки вне Telegram WebApp
const DEV_MOCK_USER = {
  id: 99281932,
  first_name: 'Andrew',
  last_name: 'Rogue',
  username: 'rogue',
  language_code: 'en',
  is_premium: true,
  allows_write_to_pm: true,
  photo_url: 'https://t.me/i/userpic/320/rogue.jpg',
};
const DEV_MOCK_INITDATA =
  'user=' +
  encodeURIComponent(JSON.stringify(DEV_MOCK_USER)) +
  '&hash=89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31' +
  '&auth_date=1716922846&start_param=debug&chat_type=sender&chat_instance=8428209589180549439&signature=6fbdaab833d39f54518bd5c3eb3f511d035e68cb';

const isDevMock = () =>
  typeof window !== 'undefined' &&
  (!window.Telegram || !window.Telegram.WebApp) &&
  (import.meta?.env?.DEV || import.meta.env.VITE_NODE_ENV === 'development');
const isMockApi = () => typeof window !== 'undefined' && window.USE_MOCK_API === true;

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
      let tg;
      if (isDevMock()) {
        tg = {
          initData: DEV_MOCK_INITDATA,
          initDataUnsafe: { user: DEV_MOCK_USER, start_param: 'debug' },
          ready: () => {},
          expand: () => {},
        };
      } else {
        tg = await waitForTelegram();
      }

      console.log('✅ Telegram WebApp available');

      // Ждем дополнительно для полной инициализации
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Получаем initData от Telegram
      let initData = tg.initData;
      if (!initData && tg.initDataUnsafe) {
        initData = JSON.stringify(tg.initDataUnsafe);
      }
      if (!initData) {
        throw new Error('No init data from Telegram WebApp');
      }

      console.log('🔍 Initializing with Telegram data...');

      // Мок-режим: возвращаем DEV_MOCK_USER без запросов
      if (isMockApi()) {
        setUser(DEV_MOCK_USER);
        setIsAuthenticated(true);
        return;
      }

      // Если dev mock, не делаем реальный запрос на /auth, а сразу возвращаем пользователя
      if (isDevMock()) {
        setUser(DEV_MOCK_USER);
        setIsAuthenticated(true);
        tg.ready && tg.ready();
        tg.expand && tg.expand();
        return;
      }

      // Отправляем initData на auth-service для валидации
      const authResponse = await fetch(`${API_BASE_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          init_data: typeof initData === 'string' ? initData : JSON.stringify(initData),
        }),
      });

      const authData = await authResponse.json();

      if (!authResponse.ok || !authData.success) {
        // Если dev-режим, возвращаем мок-данные даже при ошибке авторизации
        if (isDevMock()) {
          setUser(DEV_MOCK_USER);
          setIsAuthenticated(true);
          tg.ready && tg.ready();
          tg.expand && tg.expand();
          return;
        }
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
    reinitialize: initializeTelegram,
  };
};
