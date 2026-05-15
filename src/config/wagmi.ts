import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  rainbowWallet,
  trustWallet,
  phantomWallet,
  safeWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { mainnet, polygon, arbitrum, optimism, base, bsc, avalanche, sepolia } from 'wagmi/chains';
import { APP_NAME } from './constants';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '';
const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY || '';

function rpc(alchemyPath: string, proxyPath: string): ReturnType<typeof http> {
  if (alchemyKey && alchemyPath) return http(`https://${alchemyPath}.g.alchemy.com/v2/${alchemyKey}`);
  return http(`/api/rpc/${proxyPath}`);
}

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        coinbaseWallet,
        walletConnectWallet,
        rainbowWallet,
      ],
    },
    {
      groupName: 'More Wallets',
      wallets: [
        trustWallet,
        phantomWallet,
        ledgerWallet,
        safeWallet,
      ],
    },
  ],
  {
    appName: APP_NAME,
    projectId,
  },
);

export const wagmiConfig = createConfig({
  connectors,
  chains: [mainnet, polygon, arbitrum, optimism, base, bsc, avalanche, sepolia],
  transports: {
    [mainnet.id]: rpc('eth-mainnet', 'eth'),
    [polygon.id]: rpc('polygon-mainnet', 'polygon'),
    [arbitrum.id]: rpc('arb-mainnet', 'arbitrum'),
    [optimism.id]: rpc('opt-mainnet', 'optimism'),
    [base.id]: rpc('base-mainnet', 'base'),
    [bsc.id]: rpc('', 'bsc'),
    [avalanche.id]: rpc('', 'avalanche'),
    [sepolia.id]: rpc('eth-sepolia', 'sepolia'),
  },
  ssr: false,
});
