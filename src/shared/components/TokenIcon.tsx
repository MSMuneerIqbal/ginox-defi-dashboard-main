import React from 'react';

interface TokenIconProps {
  symbol: string;
  size?: number;
}

function BtcIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd">
        <circle cx="16" cy="16" r="16" fill="#F7931A" />
        <path
          fill="#FFF"
          fillRule="nonzero"
          d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.745-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.827.638.806 1.006l-.807 3.238c.048.012.11.03.18.057l-.183-.046-1.132 4.54c-.086.213-.304.531-.795.41.018.025-1.256-.314-1.256-.314l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.709-2.844c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"
        />
      </g>
    </svg>
  );
}

function EthIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd">
        <circle cx="16" cy="16" r="16" fill="#627EEA" />
        <g fill="#FFF" fillRule="nonzero">
          <path fillOpacity=".602" d="M16.498 4v8.87l7.497 3.35z" />
          <path d="M16.498 4L9 16.22l7.498-3.35z" />
          <path fillOpacity=".602" d="M16.498 21.968v6.027L24 17.616z" />
          <path d="M16.498 27.995v-6.028L9 17.616z" />
          <path fillOpacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z" />
          <path fillOpacity=".602" d="M9 16.22l7.498 4.353v-7.701z" />
        </g>
      </g>
    </svg>
  );
}

function BnbIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd">
        <circle cx="16" cy="16" r="16" fill="#F3BA2F" />
        <path
          fill="#FFF"
          d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.259L16 26l-6.144-6.144-.003-.003 2.263-2.257zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.188-.002h.002V16L16 18.294l-2.291-2.29-.004-.004.004-.003.401-.402.195-.195L16 13.706l2.293 2.293z"
        />
      </g>
    </svg>
  );
}

function UsdcIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd">
        <circle cx="16" cy="16" r="16" fill="#2775CA" />
        <path fill="#FFF" d="M20.022 18.124c0-2.124-1.28-2.852-3.838-3.156-1.828-.24-2.193-.728-2.193-1.58 0-.852.608-1.396 1.824-1.396 1.097 0 1.707.364 2.008 1.276a.436.436 0 0 0 .42.308h.96a.398.398 0 0 0 .4-.424v-.06a3.22 3.22 0 0 0-2.86-2.544v-1.484c0-.24-.18-.424-.48-.484h-.884c-.24 0-.424.18-.484.484v1.424c-1.888.244-3.1 1.46-3.1 2.972 0 1.944 1.22 2.736 3.777 3.04 1.704.304 2.253.668 2.253 1.64 0 .972-.852 1.64-2.012 1.64-1.584 0-2.132-.668-2.316-1.58a.456.456 0 0 0-.424-.328h-1.028a.398.398 0 0 0-.396.424v.06c.3 1.58 1.22 2.732 3.3 3.04v1.484c0 .24.18.424.48.484h.884c.24 0 .424-.18.484-.484v-1.484c1.888-.304 3.224-1.52 3.224-3.196z" />
      </g>
    </svg>
  );
}

function SolIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd">
        <circle cx="16" cy="16" r="16" fill="#000" />
        <defs>
          <linearGradient id="sol-a" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9945FF" />
            <stop offset="50%" stopColor="#14F195" />
            <stop offset="100%" stopColor="#00D1FF" />
          </linearGradient>
        </defs>
        <path fill="url(#sol-a)" d="M9.5 20.7a.67.67 0 0 1 .47-.2h14.96c.3 0 .45.36.24.57l-2.92 2.93a.67.67 0 0 1-.47.2H6.82a.33.33 0 0 1-.24-.57l2.92-2.93zM9.5 8.2a.69.69 0 0 1 .47-.2h14.96c.3 0 .45.36.24.57l-2.92 2.93a.67.67 0 0 1-.47.2H6.82a.33.33 0 0 1-.24-.57L9.5 8.2zm12.73 6.12a.67.67 0 0 0-.47-.2H6.82a.33.33 0 0 0-.24.57l2.92 2.93a.67.67 0 0 0 .47.2h14.96c.3 0 .45-.36.24-.57l-2.92-2.93z" />
      </g>
    </svg>
  );
}

function LinkIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd">
        <circle cx="16" cy="16" r="16" fill="#2A5ADA" />
        <path fill="#FFF" d="M16 6l-1.8 1.05-5.4 3.15L7 11.25v9.5l1.8 1.05 5.4 3.15L16 26l1.8-1.05 5.4-3.15L25 20.75v-9.5l-1.8-1.05-5.4-3.15L16 6zm-3.6 14.95V11.05L16 8.9l3.6 2.15v9.9L16 23.1l-3.6-2.15z" />
      </g>
    </svg>
  );
}

function DogeIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd">
        <circle cx="16" cy="16" r="16" fill="#C2A633" />
        <path fill="#FFF" d="M13.248 14.61h4.314v2.286h-4.314v4.063h2.286c1.893 0 3.428-.477 4.533-1.37 1.117-.903 1.68-2.18 1.68-3.813 0-1.61-.563-2.875-1.68-3.778-1.105-.892-2.64-1.346-4.533-1.346h-2.286v4.063-.105zm-2.286-6.24h4.57c2.732 0 4.907.72 6.487 2.168 1.58 1.448 2.37 3.398 2.37 5.846 0 2.472-.79 4.434-2.37 5.882-1.58 1.448-3.755 2.168-6.487 2.168h-4.57V8.37z" />
      </g>
    </svg>
  );
}

function WbtcIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd">
        <circle cx="16" cy="16" r="16" fill="#F09242" />
        <path fill="#282138" d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.745-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.827.638.806 1.006l-.807 3.238c.048.012.11.03.18.057l-.183-.046-1.132 4.54c-.086.213-.304.531-.795.41.018.025-1.256-.314-1.256-.314l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.709-2.844c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z" />
      </g>
    </svg>
  );
}

const ICON_MAP: Record<string, (props: { size: number }) => React.JSX.Element> = {
  BTC: BtcIcon,
  ETH: EthIcon,
  BNB: BnbIcon,
  USDC: UsdcIcon,
  SOL: SolIcon,
  LINK: LinkIcon,
  DOGE: DogeIcon,
  WBTC: WbtcIcon,
};

export function TokenIcon({ symbol, size = 32 }: TokenIconProps) {
  const IconComponent = ICON_MAP[symbol.toUpperCase()];

  if (IconComponent) {
    return <IconComponent size={size} />;
  }

  const hue = symbol.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: 999,
      background: `hsl(${hue} 70% 50%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 700,
      fontSize: size * 0.38,
      fontFamily: 'var(--font-mono)',
      flexShrink: 0,
    }}>
      {symbol[0]}
    </div>
  );
}
