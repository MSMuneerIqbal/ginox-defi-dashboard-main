import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useConnect } from 'wagmi';
import type { Connector } from 'wagmi';
import { toast } from '@/stores/toastStore';
import {
  MetaMaskIcon,
  CoinbaseIcon,
  WalletConnectIcon,
  TrustWalletIcon,
  PhantomIcon,
  RainbowIcon,
  LedgerIcon,
  SafeIcon,
} from './walletIcons';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type WalletGroup = 'popular' | 'more';

interface WalletEntry {
  /** Substring matched against connector.id and connector.name. */
  matchers: string[];
  label: string;
  /** Short tagline shown on mobile rows (e.g. "Browser extension", "Mobile + QR"). */
  tagline: string;
  icon: (props: { size?: number }) => React.ReactElement;
  group: WalletGroup;
}

const WALLETS: WalletEntry[] = [
  { matchers: ['metamask', 'metaMask'], label: 'MetaMask', tagline: 'Browser extension · Mobile', icon: MetaMaskIcon, group: 'popular' },
  { matchers: ['coinbase'], label: 'Coinbase Wallet', tagline: 'Wallet + onramp', icon: CoinbaseIcon, group: 'popular' },
  { matchers: ['walletconnect', 'wallet-connect'], label: 'WalletConnect', tagline: 'Scan with mobile wallet', icon: WalletConnectIcon, group: 'popular' },
  { matchers: ['trust'], label: 'Trust Wallet', tagline: 'Multi-chain mobile', icon: TrustWalletIcon, group: 'more' },
  { matchers: ['phantom'], label: 'Phantom', tagline: 'EVM + Solana', icon: PhantomIcon, group: 'more' },
  { matchers: ['rainbow'], label: 'Rainbow', tagline: 'Ethereum mobile', icon: RainbowIcon, group: 'more' },
  { matchers: ['ledger'], label: 'Ledger', tagline: 'Hardware wallet', icon: LedgerIcon, group: 'more' },
  { matchers: ['safe'], label: 'Safe', tagline: 'Multisig smart account', icon: SafeIcon, group: 'more' },
];

function matchConnector(entry: WalletEntry, connectors: readonly Connector[]): Connector | undefined {
  return connectors.find((c) => {
    const id = c.id.toLowerCase();
    const name = c.name.toLowerCase();
    return entry.matchers.some((m) => id.includes(m.toLowerCase()) || name.includes(m.toLowerCase()));
  });
}

export function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  const { connectors, connect, isPending } = useConnect();
  const [pendingMatcher, setPendingMatcher] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) setPendingMatcher(null);
  }, [isOpen]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const grouped = useMemo(() => ({
    popular: WALLETS.filter((w) => w.group === 'popular'),
    more: WALLETS.filter((w) => w.group === 'more'),
  }), []);

  const handleConnect = (entry: WalletEntry) => {
    const connector = matchConnector(entry, connectors);
    if (!connector) {
      toast.error(`${entry.label} is not configured`, 'Connect Wallet');
      return;
    }
    setPendingMatcher(entry.matchers[0]);
    connect(
      { connector },
      {
        onSuccess: () => {
          setPendingMatcher(null);
          onClose();
        },
        onError: (err) => {
          setPendingMatcher(null);
          const msg = err.message?.toLowerCase() ?? '';
          if (msg.includes('reject') || msg.includes('denied') || msg.includes('user')) {
            toast.info('Connection cancelled', entry.label);
          } else {
            toast.error(err.message || `Could not connect ${entry.label}`, entry.label);
          }
        },
      },
    );
  };

  if (!isOpen) return null;

  // Portal to document.body to escape any ancestor that creates a containing
  // block for position:fixed (backdrop-filter on header, transform on .glass
  // cards, etc.). Without this the modal gets clipped to its parent's box.
  return createPortal(
    <div className="cw-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="cw-title">
      <div className="cw-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Drag handle (mobile bottom-sheet affordance) */}
        <div className="cw-handle" aria-hidden="true" />

        {/* Header */}
        <div className="cw-header">
          <div>
            <div id="cw-title" className="cw-title">Connect Wallet</div>
            <div className="cw-subtitle">Choose how you'd like to connect</div>
          </div>
          <button
            className="cw-close"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="m4 4 8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        <div className="cw-body">
          <div className="cw-section-label">Popular</div>
          <WalletList wallets={grouped.popular} onConnect={handleConnect} pendingMatcher={pendingMatcher} isPending={isPending} />

          <div className="cw-section-label cw-section-label--spaced">More wallets</div>
          <WalletList wallets={grouped.more} onConnect={handleConnect} pendingMatcher={pendingMatcher} isPending={isPending} />
        </div>

        <div className="cw-footer">
          <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="7" width="10" height="7" rx="1.5" />
            <path d="M5 7V5a3 3 0 0 1 6 0v2" />
          </svg>
          <span>By connecting, you agree to our <a href="#" onClick={(e) => e.preventDefault()}>Terms</a> and <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

interface WalletListProps {
  wallets: WalletEntry[];
  onConnect: (entry: WalletEntry) => void;
  pendingMatcher: string | null;
  isPending: boolean;
}

function WalletList({ wallets, onConnect, pendingMatcher, isPending }: WalletListProps) {
  return (
    <div className="cw-wallet-list">
      {wallets.map((w) => {
        const isThisPending = pendingMatcher === w.matchers[0];
        const isOtherPending = isPending && !isThisPending;
        const Icon = w.icon;
        return (
          <button
            key={w.label}
            type="button"
            onClick={() => onConnect(w)}
            disabled={isPending}
            className={`cw-wallet-row ${isThisPending ? 'is-pending' : ''} ${isOtherPending ? 'is-dimmed' : ''}`}
          >
            <div className="cw-wallet-icon">
              <Icon size={36} />
            </div>
            <div className="cw-wallet-meta">
              <div className="cw-wallet-name">{w.label}</div>
              <div className="cw-wallet-tagline">{isThisPending ? 'Waiting for approval…' : w.tagline}</div>
            </div>
            {isThisPending ? (
              <div className="cw-wallet-spinner" aria-hidden="true" />
            ) : (
              <svg className="cw-wallet-chevron" width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m6 4 4 4-4 4" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
