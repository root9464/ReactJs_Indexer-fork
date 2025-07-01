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

function isDevMock() {
  return (
    typeof window !== 'undefined' &&
    (!window.Telegram || !window.Telegram.WebApp) &&
    (import.meta?.env?.DEV || process.env.NODE_ENV === 'development')
  );
}

// Получаем объект Telegram Web App
export const getTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp;
  }
  // Возвращаем мок-объект для разработки
  if (isDevMock()) {
    return {
      initData: DEV_MOCK_INITDATA,
      initDataUnsafe: { user: DEV_MOCK_USER, start_param: 'debug' },
      colorScheme: 'light',
      isExpanded: true,
      platform: 'tdesktop',
      ready: () => {},
      expand: () => {},
      setHeaderColor: () => {},
      setBackgroundColor: () => {},
      MainButton: {
        show: () => {},
        hide: () => {},
        onClick: () => {},
        text: ''
      },
      showAlert: (msg) => alert(msg),
      showPopup: ({ message }) => alert(message),
      close: () => {},
    };
  }
  return null;
};

// Получение username пользователя
export const getTelegramUsername = () => {
  const tg = getTelegramWebApp();
  if (!tg) {
    return null;
  }

  if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user;
    
    // КРИТИЧЕСКАЯ ПРОВЕРКА: username должен существовать и быть непустым
    if (user.username && user.username.trim() !== '') {
      const cleanUsername = user.username.trim();
      
      // ДОПОЛНИТЕЛЬНАЯ ВАЛИДАЦИЯ username формата
      if (!/^[a-zA-Z0-9_]{5,32}$/.test(cleanUsername)) {
        return null;
      }
      
      return cleanUsername;
    }
    
    return null;
  }
  
  return null;
};

// Инициализируем Telegram Web App
export const initTelegramWebApp = () => {
  const tg = getTelegramWebApp();
  if (tg) {
    try {
      tg.ready();
      tg.expand();
      
      // Настраиваем тему - белый фон
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
      
      // Настраиваем header цвет на белый
      if (tg.setHeaderColor) {
        tg.setHeaderColor('#ffffff');
      }
      
      // Настраиваем цвет фона
      if (tg.setBackgroundColor) {
        tg.setBackgroundColor('#ffffff');
      }
      
      const result = {
        user: tg.initDataUnsafe?.user,
        initData: tg.initData,
        colorScheme: tg.colorScheme,
        isExpanded: tg.isExpanded,
        platform: tg.platform,
        startParam: tg.initDataUnsafe?.start_param
      };
      
      return result;
    } catch (error) {
      // Silent error handling for production
    }
  }
  
  return null;
};

// Простая валидация без URLSearchParams
export const validateTelegramData = (initData) => {
  return !!(initData && typeof initData === 'string' && initData.length > 10);
};

// Получение пользовательских данных с фото
export const getTelegramUser = () => {
  const tg = getTelegramWebApp();
  if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user;
    
    return {
      ...user,
      photo_url: user.photo_url || null
    };
  }
  
  return null;
};

// Закрытие Web App
export const closeTelegramWebApp = () => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.close();
  }
};

// Показать главную кнопку
export const showMainButton = (text, onClick) => {
  const tg = getTelegramWebApp();
  if (tg && tg.MainButton) {
    tg.MainButton.show();
    tg.MainButton.onClick(onClick);
    tg.MainButton.text = text;
  }
};

// Скрыть главную кнопку
export const hideMainButton = () => {
  const tg = getTelegramWebApp();
  if (tg && tg.MainButton) {
    tg.MainButton.hide();
  }
};

// Открытие настроек Telegram - упрощенная версия
export const openTelegramSettings = () => {
  const tg = getTelegramWebApp();
  
  // Показываем инструкцию пользователю
  const instructions = `To set up your username:

1. Close this app
2. Go to Telegram Settings (☰ menu → Settings)  
3. Tap on "Username"
4. Choose your unique @username
5. Save changes
6. Wait 5 minutes for changes to take effect
7. Return to this app and refresh`;

  if (tg && tg.showAlert) {
    tg.showAlert(instructions);
  } else if (tg && tg.showPopup) {
    tg.showPopup({
      title: 'Setup Username',
      message: instructions,
      buttons: [
        {id: 'ok', type: 'ok', text: 'Got it'}
      ]
    });
  } else {
    alert(instructions);
  }
};

// Альтернативная функция - тоже только инструкция
export const openTelegramSettingsAlternative = () => {
  alert('Please open Telegram Settings manually:\n1. Go to Settings ☰\n2. Select Username\n3. Set your @username\n4. Wait 5 minutes for changes to take effect\n5. Return to app');
};
