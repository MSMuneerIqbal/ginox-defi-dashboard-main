import { mainnet, bsc, polygon, arbitrum, optimism, base, avalanche, sepolia } from 'wagmi/chains';

export const supportedChains = [mainnet, polygon, arbitrum, optimism, base, bsc, avalanche, sepolia] as const;

export const defaultChain = mainnet;

export const chainMeta: Record<number, { label: string; color: string; icon: string }> = {
  [mainnet.id]: {
    label: 'Ethereum',
    color: '#627EEA',
    icon: 'ETH',
  },
  [polygon.id]: {
    label: 'Polygon',
    color: '#8247E5',
    icon: 'MATIC',
  },
  [arbitrum.id]: {
    label: 'Arbitrum',
    color: '#28A0F0',
    icon: 'ETH',
  },
  [optimism.id]: {
    label: 'Optimism',
    color: '#FF0420',
    icon: 'ETH',
  },
  [base.id]: {
    label: 'Base',
    color: '#0052FF',
    icon: 'ETH',
  },
  [bsc.id]: {
    label: 'BNB Chain',
    color: '#F0B90B',
    icon: 'BNB',
  },
  [avalanche.id]: {
    label: 'Avalanche',
    color: '#E84142',
    icon: 'AVAX',
  },
  [sepolia.id]: {
    label: 'Sepolia',
    color: '#627EEA',
    icon: 'ETH',
  },
};

export const SUPPORTED_CHAINS = [
  { id: mainnet.id, name: 'Ethereum', short: 'ETH', color: '#627EEA', testnet: false },
  { id: polygon.id, name: 'Polygon', short: 'MATIC', color: '#8247E5', testnet: false },
  { id: arbitrum.id, name: 'Arbitrum', short: 'ARB', color: '#28A0F0', testnet: false },
  { id: optimism.id, name: 'Optimism', short: 'OP', color: '#FF0420', testnet: false },
  { id: base.id, name: 'Base', short: 'BASE', color: '#0052FF', testnet: false },
  { id: bsc.id, name: 'BNB Chain', short: 'BSC', color: '#F0B90B', testnet: false },
  { id: avalanche.id, name: 'Avalanche', short: 'AVAX', color: '#E84142', testnet: false },
  { id: sepolia.id, name: 'Sepolia', short: 'SEP', color: '#8A92B2', testnet: true },
];
