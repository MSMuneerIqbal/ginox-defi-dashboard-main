interface IconProps {
  size?: number;
}

function WalletLogo({ src, alt, size = 32 }: { src: string; alt: string; size?: number }) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      style={{ display: 'block', objectFit: 'contain' }}
      aria-hidden="true"
    />
  );
}

export function MetaMaskIcon({ size = 32 }: IconProps) {
  return <WalletLogo src="/logos/metamask%20logo.svg" alt="MetaMask" size={size} />;
}

export function CoinbaseIcon({ size = 32 }: IconProps) {
  return <WalletLogo src="/logos/coinbase%20logo.svg" alt="Coinbase Wallet" size={size} />;
}

export function WalletConnectIcon({ size = 32 }: IconProps) {
  return <WalletLogo src="/logos/wallet%20connect%20logo.svg" alt="WalletConnect" size={size} />;
}

export function TrustWalletIcon({ size = 32 }: IconProps) {
  return <WalletLogo src="/logos/trust%20wallet%20logo.svg" alt="Trust Wallet" size={size} />;
}

export function PhantomIcon({ size = 32 }: IconProps) {
  return <WalletLogo src="/logos/phantom%20logo%20png.png" alt="Phantom" size={size} />;
}

export function RainbowIcon({ size = 32 }: IconProps) {
  return <WalletLogo src="/logos/rainbow%20logo%20png.png" alt="Rainbow" size={size} />;
}

export function LedgerIcon({ size = 32 }: IconProps) {
  return <WalletLogo src="/logos/ledger%20logo%20png.png" alt="Ledger" size={size} />;
}

export function SafeIcon({ size = 32 }: IconProps) {
  return <WalletLogo src="/logos/safe%20logo%20png.jpg" alt="Safe" size={size} />;
}

export const WALLET_ICONS: Record<string, (props: IconProps) => React.ReactElement> = {
  metaMask: MetaMaskIcon,
  coinbase: CoinbaseIcon,
  walletConnect: WalletConnectIcon,
  trust: TrustWalletIcon,
  phantom: PhantomIcon,
  rainbow: RainbowIcon,
  ledger: LedgerIcon,
  safe: SafeIcon,
};
