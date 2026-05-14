/**
 * Hand-rolled SVG icons for the custom Connect Wallet modal. Each icon is
 * stroke-only (currentColor) so the cards can theme them consistently with
 * the dashboard accent palette — no PNG bundles, no third-party icon library.
 */

interface IconProps {
  size?: number;
}

export function MetaMaskIcon({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M27.5 4 17.8 11.2l1.8-4.3L27.5 4Z" fill="#E2761B" stroke="#E2761B" strokeWidth=".5" strokeLinejoin="round" />
      <path d="m4.5 4 9.6 7.3-1.7-4.4L4.5 4Zm19.4 16.2-2.6 3.9 5.5 1.5 1.6-5.3-4.5-.1Zm-21.9.1 1.6 5.3 5.5-1.5-2.6-3.9-4.5.1Z" fill="#E4761B" stroke="#E4761B" strokeWidth=".5" strokeLinejoin="round" />
      <path d="M7.7 14 6.2 16.3l5.5.25-.2-5.9-3.8 3.35Zm16.6 0-3.85-3.4-.15 6 5.5-.25L24.3 14Zm-15 9.6 3.3-1.6-2.85-2.2-.45 3.8Zm8.1-1.6 3.3 1.6-.45-3.8L17.4 22Z" fill="#E4761B" stroke="#E4761B" strokeWidth=".5" strokeLinejoin="round" />
      <path d="m20.7 23.6-3.3-1.6.27 2.15-.03.9 3.06-1.45Zm-9.4 0 3.06 1.45-.02-.9.25-2.15-3.3 1.6Z" fill="#D7C1B3" stroke="#D7C1B3" strokeWidth=".5" strokeLinejoin="round" />
      <path d="m14.4 19-2.75-.8 1.95-.9.8 1.7Zm3.2 0 .8-1.7 1.95.9-2.75.8Z" fill="#233447" stroke="#233447" strokeWidth=".5" strokeLinejoin="round" />
      <path d="m11.3 23.6.46-3.9-3 .1 2.54 3.8Zm9.45-3.9.45 3.9 2.54-3.8-2.99-.1Zm5.05-3.4-5.5.25.51 2.84 2.74-.05 2.25-3.04Zm-19.6 0 2.24 3.04 2.75.05.5-2.84-5.5-.25Z" fill="#CD6116" stroke="#CD6116" strokeWidth=".5" strokeLinejoin="round" />
      <path d="m11.7 16.3.5 2.83 2.2-1.13-2.7-1.7Zm6.86 1.7 2.2 1.13.5-2.83-2.7 1.7Z" fill="#CD6116" stroke="#CD6116" strokeWidth=".5" strokeLinejoin="round" />
    </svg>
  );
}

export function CoinbaseIcon({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="14" fill="#1652F0" />
      <path d="M16 6c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S21.52 6 16 6Zm-2.5 13.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5Z" fill="#fff" />
    </svg>
  );
}

export function WalletConnectIcon({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#3B99FC" />
      <path d="M9.6 12.7c3.5-3.4 9.3-3.4 12.8 0l.4.4a.4.4 0 0 1 0 .6l-1.4 1.35a.2.2 0 0 1-.3 0l-.6-.55c-2.45-2.4-6.45-2.4-8.9 0l-.6.6a.2.2 0 0 1-.3 0l-1.4-1.4a.4.4 0 0 1 0-.6l.3-.4Zm15.8 3 1.25 1.25a.4.4 0 0 1 0 .6l-5.6 5.5a.4.4 0 0 1-.6 0L17 19.4a.1.1 0 0 0-.15 0L13.4 23a.4.4 0 0 1-.6 0l-5.6-5.5a.4.4 0 0 1 0-.6L8.45 15.7a.4.4 0 0 1 .6 0l3.45 3.4a.1.1 0 0 0 .15 0L16.1 15.7a.4.4 0 0 1 .6 0l3.45 3.4a.1.1 0 0 0 .15 0l3.45-3.4a.4.4 0 0 1 .6 0Z" fill="#fff" />
    </svg>
  );
}

export function TrustWalletIcon({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 3 5 7v8.5c0 5.6 4.4 11.4 11 13.5 6.6-2.1 11-7.9 11-13.5V7L16 3Z" fill="url(#tw-grad)" />
      <defs>
        <linearGradient id="tw-grad" x1="16" y1="3" x2="16" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#33A0FF" />
          <stop offset="1" stopColor="#0500FF" />
        </linearGradient>
      </defs>
      <path d="M16 6.2 8 9v6.4c0 4.4 3.4 8.9 8 10.4V6.2Z" fill="#fff" />
    </svg>
  );
}

export function PhantomIcon({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="url(#ph-grad)" />
      <defs>
        <linearGradient id="ph-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#534BB1" />
          <stop offset="1" stopColor="#551BF9" />
        </linearGradient>
      </defs>
      <path d="M23 16.4c0 4.05-3.1 7.6-7 7.6-2.9 0-5.4-2-6.4-4.7-.3-.85.45-1.65 1.35-1.6.6.05 1.1.5 1.3 1.08.55 1.55 2.05 2.62 3.75 2.62 2.2 0 4-1.95 4-4.35V13.7a.55.55 0 0 1 .55-.55h1.9c.3 0 .55.25.55.55v2.7Zm-9 0c0 .85-.65 1.55-1.4 1.55-.8 0-1.4-.7-1.4-1.55v-1.8c0-.85.6-1.55 1.4-1.55s1.4.7 1.4 1.55v1.8Zm5 0c0 .85-.65 1.55-1.4 1.55-.8 0-1.4-.7-1.4-1.55v-1.8c0-.85.6-1.55 1.4-1.55s1.4.7 1.4 1.55v1.8Z" fill="#fff" />
    </svg>
  );
}

export function RainbowIcon({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#001E59" />
      <path d="M6 6h2a18 18 0 0 1 18 18v2h-3v-2A15 15 0 0 0 8 9H6V6Z" fill="url(#rb-1)" />
      <path d="M6 11h2a13 13 0 0 1 13 13v2h-3v-2A10 10 0 0 0 8 14H6v-3Z" fill="url(#rb-2)" />
      <path d="M6 16h2a8 8 0 0 1 8 8v2h-3v-2a5 5 0 0 0-5-5H6v-3Z" fill="url(#rb-3)" />
      <path d="M6 21h2a3 3 0 0 1 3 3v2H6v-5Z" fill="url(#rb-4)" />
      <defs>
        <linearGradient id="rb-1" x1="6" y1="6" x2="26" y2="26"><stop stopColor="#FF4000" /><stop offset="1" stopColor="#8754C9" /></linearGradient>
        <linearGradient id="rb-2" x1="6" y1="11" x2="21" y2="26"><stop stopColor="#FFB400" /></linearGradient>
        <linearGradient id="rb-3" x1="6" y1="16" x2="16" y2="26"><stop stopColor="#00AAFF" /><stop offset="1" stopColor="#01DA40" /></linearGradient>
        <linearGradient id="rb-4" x1="6" y1="21" x2="11" y2="26"><stop stopColor="#174299" /><stop offset="1" stopColor="#001E59" /></linearGradient>
      </defs>
    </svg>
  );
}

export function LedgerIcon({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#000" />
      <path d="M8 8v6h2v-4h4V8H8Zm14 0v2h4v4h2V8h-6ZM8 18v6h6v-2h-4v-4H8Zm18 0v4h-4v2h6v-6h-2Z" fill="#fff" />
    </svg>
  );
}

export function SafeIcon({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#12FF80" />
      <path d="M11 11h7a3 3 0 0 1 3 3v.5h-3V14h-7v-3Zm10 5h-7a3 3 0 0 0-3 3v.5h3V19h7v-3Z" fill="#000" />
      <circle cx="16" cy="16" r="2.4" stroke="#000" strokeWidth="1.4" />
    </svg>
  );
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
