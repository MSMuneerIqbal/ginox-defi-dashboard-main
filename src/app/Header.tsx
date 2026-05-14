import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useAccount, useBalance, useDisconnect, useSwitchChain } from 'wagmi';
import { useClipboard } from '@/shared/hooks/useClipboard';
import { truncateAddress } from '@/shared/utils/format';
import { SUPPORTED_CHAINS } from '@/config/chains';
import { useLeaderboardStore } from '@/stores/leaderboardStore';
import { debounce } from '@/shared/utils/debounce';
import { SEARCH_DEBOUNCE_MS } from '@/config/constants';
import { ConnectWalletModal } from '@/features/wallet/components';

function Logo() {
  return (
    <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 0, textDecoration: 'none', color: 'var(--color-text)' }}>
      <img
        src="/logo.svg"
        alt="Ginox"
        style={{ height: 30 }}
        draggable={false}
      />
    </a>
  );
}

const NAV_ITEMS = [
  { label: 'Dashboard', target: 'top' },
  { label: 'Leaderboard', target: 'section-leaderboard' },
  { label: 'Markets', target: 'section-ticker' },
  { label: 'Portfolio', target: 'section-portfolio' },
];

function NetworkPicker() {
  const [open, setOpen] = useState(false);
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();

  const currentChain = SUPPORTED_CHAINS.find(c => c.id === chain?.id) || SUPPORTED_CHAINS[0];

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="btn"
        onClick={() => setOpen(o => !o)}
        style={{ paddingLeft: 10, paddingRight: 8 }}
      >
        <span className="chain-chip" style={{ background: currentChain.color, color: '#fff', width: 16, height: 16 }}>
          {currentChain.short[0]}
        </span>
        <span style={{ fontSize: 12, fontWeight: 500 }}>{currentChain.name}</span>
        <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setOpen(false)} />
          <div className="dropdown-panel" style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 50,
            width: 220, padding: 6, borderRadius: 10,
            maxHeight: 'calc(100vh - 90px)', overflowY: 'auto',
          }}>
            <div className="eyebrow" style={{ padding: '8px 10px 4px', position: 'sticky', top: 0, background: 'inherit' }}>Switch network</div>
            {SUPPORTED_CHAINS.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  switchChain?.({ chainId: c.id });
                  setOpen(false);
                }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', background: c.id === currentChain.id ? 'rgba(10,196,136,0.08)' : 'transparent',
                  border: 'none', borderRadius: 6, color: 'var(--color-text)',
                  fontSize: 13, cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span className="chain-chip" style={{ background: c.color, color: '#fff', width: 18, height: 18 }}>
                  {c.short[0]}
                </span>
                <span style={{ flex: 1 }}>{c.name}</span>
                {c.testnet && <span style={{ fontSize: 9, color: 'var(--color-warning)' }}>TEST</span>}
                {c.id === currentChain.id && (
                  <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 8 3.5 3.5L13 5" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ConnectedPill() {
  const { address, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const { copied, copy } = useClipboard();
  const [open, setOpen] = useState(false);

  if (!address) return null;

  const explorerUrl = chain?.blockExplorers?.default?.url
    ? `${chain.blockExplorers.default.url}/address/${address}`
    : `https://etherscan.io/address/${address}`;

  const displayAddr = truncateAddress(address);
  const displayBal = balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '';

  return (
    <div style={{ position: 'relative' }}>
      <button className="btn" onClick={() => setOpen(o => !o)} style={{ paddingLeft: 4, paddingRight: 10, gap: 8 }}>
        <div
          className="avatar"
          style={{
            width: 26, height: 26,
            background: 'conic-gradient(from 120deg, hsl(160 80% 55%), hsl(210 85% 60%), hsl(185 75% 50%), hsl(160 80% 55%))',
          }}
        >
          <div style={{
            position: 'absolute', inset: 1, borderRadius: 999,
            background: 'radial-gradient(circle at 30% 30%, hsl(210 90% 70%), hsl(160 80% 35%) 80%)',
          }} />
        </div>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
          <span style={{ fontSize: 12, fontWeight: 500 }}>{displayAddr}</span>
          <span className="num" style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{displayBal}</span>
        </span>
        <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setOpen(false)} />
          <div className="dropdown-panel" style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 50, width: 280, padding: 14, borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div
                className="avatar"
                style={{
                  width: 40, height: 40,
                  background: 'conic-gradient(from 120deg, hsl(160 80% 55%), hsl(210 85% 60%), hsl(185 75% 50%), hsl(160 80% 55%))',
                }}
              >
                <div style={{
                  position: 'absolute', inset: 1, borderRadius: 999,
                  background: 'radial-gradient(circle at 30% 30%, hsl(210 90% 70%), hsl(160 80% 35%) 80%)',
                }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{displayAddr}</div>
                <div className="num" style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{displayBal}</div>
              </div>
            </div>
            <div className="div-h" style={{ margin: '10px -14px 12px' }} />
            <button onClick={() => { copy(address); }} className="btn" style={{ width: '100%', justifyContent: 'flex-start', marginBottom: 6 }}>
              {copied ? (
                <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 8 3.5 3.5L13 5" /></svg>
              ) : (
                <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="5" width="9" height="9" rx="1.5" /><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" /></svg>
              )}
              {copied ? 'Copied' : 'Copy address'}
            </button>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{ width: '100%', justifyContent: 'flex-start', marginBottom: 6, textDecoration: 'none' }}
            >
              <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h4v4M13 3 8 8M7 5H4a1.5 1.5 0 0 0-1.5 1.5v5A1.5 1.5 0 0 0 4 13h5a1.5 1.5 0 0 0 1.5-1.5V9" /></svg>
              View on explorer
            </a>
            <button onClick={() => { setOpen(false); disconnect(); }} className="btn" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--color-bearish)' }}>
              <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v6M5 4.5A5 5 0 1 0 11 4.5" /></svg>
              Disconnect
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function HeaderSearch() {
  const setSearchQuery = useLeaderboardStore((s) => s.setSearchQuery);
  const searchQuery = useLeaderboardStore((s) => s.searchQuery);
  const [value, setValue] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useMemo(
    () => debounce((q: string) => setSearchQuery(q), SEARCH_DEBOUNCE_MS),
    [setSearchQuery],
  );

  // Sync external store changes (e.g. leaderboard filter cleared)
  useEffect(() => {
    if (searchQuery === '' && value !== '') setValue('');
  }, [searchQuery]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setValue(v);
      debouncedSearch(v);
      if (v) {
        document.getElementById('section-leaderboard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [debouncedSearch],
  );

  const handleClear = useCallback(() => {
    setValue('');
    setSearchQuery('');
    inputRef.current?.focus();
  }, [setSearchQuery]);

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="input header-search" style={{
      width: 260, display: 'flex', alignItems: 'center', gap: 8,
      background: 'rgba(255,255,255,0.025)',
    }}>
      <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="7" r="4.5" />
        <path d="m13 13-2.6-2.6" />
      </svg>
      <input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        placeholder="Search markets, traders..."
        style={{
          background: 'transparent', border: 'none', color: 'inherit',
          flex: 1, fontSize: 13, outline: 'none', fontFamily: 'inherit',
        }}
      />
      {value ? (
        <button
          className="btn btn-ghost btn-sm"
          onClick={handleClear}
          style={{ width: 20, height: 20, padding: 0, justifyContent: 'center' }}
        >
          <svg width={10} height={10} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="m4 4 8 8M12 4l-8 8" />
          </svg>
        </button>
      ) : (
        <span style={{ fontSize: 10, color: 'var(--color-text-dim)', border: '1px solid var(--color-border)', padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-mono)' }}>Ctrl+K</span>
      )}
    </div>
  );
}

export function Header() {
  const { isConnected } = useAccount();
  const [connectOpen, setConnectOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 20,
      background: 'rgba(1, 5, 16, 0.72)',
      backdropFilter: 'blur(20px) saturate(160%)',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div className="header-inner" style={{
        maxWidth: 1440, margin: '0 auto',
        padding: '0 28px',
        height: 64,
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <Logo />

        <nav className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 16 }}>
          {NAV_ITEMS.map((n, i) => (
            <a
              key={n.label}
              href={n.target === 'top' ? '#' : `#${n.target}`}
              onClick={(e) => {
                e.preventDefault();
                if (n.target === 'top') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  document.getElementById(n.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              style={{
                padding: '6px 10px',
                fontSize: 13,
                fontWeight: 500,
                color: i === 0 ? 'var(--color-text)' : 'var(--color-text-muted)',
                background: i === 0 ? 'rgba(255,255,255,0.04)' : 'transparent',
                borderRadius: 6,
                textDecoration: 'none',
              }}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        <HeaderSearch />

        {isConnected && <NetworkPicker />}

        {!isConnected ? (
          <button
            className="btn btn-primary"
            onClick={() => setConnectOpen(true)}
            style={{ gap: 8, fontWeight: 600, letterSpacing: '-0.005em', padding: '0 16px' }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
            </svg>
            <span>Connect Wallet</span>
          </button>
        ) : (
          <ConnectedPill />
        )}
      </div>
      <ConnectWalletModal isOpen={connectOpen} onClose={() => setConnectOpen(false)} />
    </header>
  );
}
