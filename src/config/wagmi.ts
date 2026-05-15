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

function rpc(alchemyPath: string, publicRpc: string): ReturnType<typeof http> {
  if (alchemyKey && alchemyPath) return http(`https://${alchemyPath}.g.alchemy.com/v2/${alchemyKey}`);
  return http(publicRpc);
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
    [mainnet.id]: rpc('eth-mainnet', 'https://cloudflare-eth.com'),
    [polygon.id]: rpc('polygon-mainnet', 'https://polygon-rpc.com'),
    [arbitrum.id]: rpc('arb-mainnet', 'https://arb1.arbitrum.io/rpc'),
    [optimism.id]: rpc('opt-mainnet', 'https://mainnet.optimism.io'),
    [base.id]: rpc('base-mainnet', 'https://mainnet.base.org'),
    [bsc.id]: rpc('', 'https://bsc-dataseed1.binance.org'),
    [avalanche.id]: rpc('', 'https://api.avax.network/ext/bc/C/rpc'),
    [sepolia.id]: rpc('eth-sepolia', 'https://rpc.sepolia.org'),
  },
  ssr: false,
});
