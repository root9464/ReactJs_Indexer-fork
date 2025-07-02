import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';

export const TonWalletButton = () => {
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();
  const sliceAddress = address?.slice(0, 6) + '...' + address?.slice(-4);
  const handleConnectWallet = () => {
    if (!address) {
      tonConnectUI.openModal();
    }
    tonConnectUI.disconnect();
  };

  return (
    <button onClick={handleConnectWallet} className='h-6 w-24 bg-white rounded-md text-black/85'>
      {address ? sliceAddress : 'Подключить кошелек'}
    </button>
  );
};
