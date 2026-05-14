import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme, type AvatarComponent } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from '@/config/wagmi';
import type { ReactNode } from 'react';

import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const rainbowTheme = darkTheme({
  accentColor: '#0AC488',
  accentColorForeground: '#021018',
  borderRadius: 'large',
  fontStack: 'system',
  overlayBlur: 'small',
});

// Deep theme overrides for a premium DeFi terminal look
rainbowTheme.colors.connectButtonBackground = 'rgba(10, 196, 136, 0.08)';
rainbowTheme.colors.connectButtonInnerBackground = 'linear-gradient(135deg, #0AC488 0%, #33A0EA 100%)';
rainbowTheme.colors.modalBackground = '#0c1220';
rainbowTheme.colors.modalBorder = 'rgba(10, 196, 136, 0.12)';
rainbowTheme.colors.modalText = '#E0E7FF';
rainbowTheme.colors.modalTextSecondary = '#94A3B8';
rainbowTheme.colors.closeButton = '#5A6585';
rainbowTheme.colors.closeButtonBackground = 'rgba(255, 255, 255, 0.04)';
rainbowTheme.colors.actionButtonBorder = 'rgba(10, 196, 136, 0.15)';
rainbowTheme.colors.actionButtonSecondaryBackground = 'rgba(255, 255, 255, 0.04)';
rainbowTheme.colors.menuItemBackground = 'rgba(10, 196, 136, 0.06)';
rainbowTheme.colors.generalBorder = 'rgba(255, 255, 255, 0.06)';
rainbowTheme.colors.profileForeground = '#0f1826';
rainbowTheme.shadows.connectButton = '0 0 0 1px rgba(10, 196, 136, 0.2), 0 4px 16px -4px rgba(10, 196, 136, 0.15)';
rainbowTheme.shadows.dialog = '0 24px 80px -16px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(10, 196, 136, 0.12)';

// Custom gradient avatar for wallet identicon
const CustomAvatar: AvatarComponent = ({ address, size }) => {
  const seed = address ? parseInt(address.slice(2, 10), 16) : 0;
  const hue1 = seed % 360;
  const hue2 = (hue1 + 120) % 360;
  const hue3 = (hue1 + 60) % 360;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: `conic-gradient(from ${seed % 360}deg, hsl(${hue1} 80% 55%), hsl(${hue2} 85% 60%), hsl(${hue3} 75% 50%), hsl(${hue1} 80% 55%))`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 1,
          borderRadius: 999,
          background: `radial-gradient(circle at 30% 30%, hsl(${hue2} 90% 70%), hsl(${hue1} 80% 35%) 80%)`,
        }}
      />
    </div>
  );
};

const appInfo = {
  appName: 'Ginox',
  learnMoreUrl: 'https://ethereum.org/en/wallets/',
  disclaimer: ({ Text, Link }: { Text: React.FC<{ children: React.ReactNode }>; Link: React.FC<{ href: string; children: React.ReactNode }> }) => (
    <Text>
      By connecting, you agree to the{' '}
      <Link href="https://ginox.io/terms">Terms of Service</Link>{' '}
      and acknowledge the{' '}
      <Link href="https://ginox.io/privacy">Privacy Policy</Link>
    </Text>
  ),
};

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={rainbowTheme}
          modalSize="wide"
          coolMode
          avatar={CustomAvatar}
          appInfo={appInfo}
          showRecentTransactions
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
