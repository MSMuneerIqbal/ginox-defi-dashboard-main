import { useState, useCallback } from 'react';
import { formatCurrency } from '@/shared/utils/format';
import { usePortfolio } from '../hooks/usePortfolio';
import { AllocationChart } from './AllocationChart';
import { TokenRow } from './TokenRow';
import { AddTokenModal } from './AddTokenModal';
import { ConnectWalletModal } from '@/features/wallet/components';
import { Skeleton } from '@/shared/components';
import { toast } from '@/stores/toastStore';
import { useTickerStore } from '@/stores/tickerStore';
import type { PortfolioToken } from '@/shared/types';
import { usePortfolioStore } from '@/stores/portfolioStore';

export function PortfolioView() {
  const {
    isConnected,
    isLoading,
    isError,
    error,
    allTokens,
    summary,
    allocations,
    removeManualToken,
  } = usePortfolio();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const tickers = useTickerStore((s) => s.tickers);
  const addManualToken = usePortfolioStore((s) => s.addManualToken);

  const handleAddToken = useCallback(
    (data: { symbol: string; balance: number; entryPrice: number; address: string }) => {
      const livePrice = tickers[data.symbol]?.price ?? 0;
      const token: PortfolioToken = {
        address: data.address,
        symbol: data.symbol,
        name: data.symbol,
        balance: data.balance,
        decimals: 18,
        entryPrice: data.entryPrice,
        currentPrice: livePrice || data.entryPrice * (0.9 + Math.random() * 0.4),
        isManual: true,
      };
      addManualToken(token);
    },
    [tickers, addManualToken],
  );

  const handleRemoveToken = useCallback(
    (address: string) => {
      removeManualToken(address);
      toast.info('Token removed from portfolio');
    },
    [removeManualToken],
  );

  if (!isConnected) {
    return (
      <div className="glass" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'block' }} aria-hidden="true">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Portfolio</span>
        </div>
        <div style={{ padding: '16px 0 8px', textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, margin: '0 auto 14px',
            borderRadius: 14,
            background: 'var(--gradient-accent-faint)',
            border: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text-muted)',
          }}>
            <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>No portfolio yet</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4, marginBottom: 16, lineHeight: 1.5 }}>
            Connect a wallet to auto-load your on-chain holdings.
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowConnectModal(true)}
            style={{ width: '100%', height: 44, justifyContent: 'center', gap: 8, fontWeight: 600, letterSpacing: '-0.005em' }}
          >
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
            </svg>
            <span>Connect Wallet</span>
          </button>
        </div>
        <ConnectWalletModal isOpen={showConnectModal} onClose={() => setShowConnectModal(false)} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="glass" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'block' }} aria-hidden="true">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Portfolio</span>
        </div>
        <div className="glass-deep" style={{ padding: 16, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 18 }}>
          <Skeleton width={120} height={120} style={{ borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Skeleton width={60} height={10} style={{ marginBottom: 8 }} />
            <Skeleton width={140} height={22} style={{ marginBottom: 10 }} />
            <Skeleton width={100} height={12} style={{ marginBottom: 12 }} />
            <div className="div-h" style={{ margin: '12px 0' }} />
            <Skeleton width={80} height={11} />
          </div>
        </div>
        <div className="eyebrow" style={{ marginBottom: 4 }}>Holdings</div>
        {[1, 2].map((i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}>
            <Skeleton width={32} height={32} style={{ borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Skeleton width={50} height={14} />
                <Skeleton width={70} height={14} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton width={80} height={11} />
                <Skeleton width={50} height={11} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'block' }} aria-hidden="true">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Portfolio</span>
        </div>
        <div style={{ padding: '16px 0 8px', textAlign: 'center' }}>
          <div style={{
            width: 44, height: 44, margin: '0 auto 12px',
            borderRadius: 999,
            background: 'rgba(255,87,87,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-bearish)',
          }}>
            <svg width={20} height={20} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
              <path d="m4 4 8 8M12 4l-8 8" />
            </svg>
          </div>
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Failed to load balances</p>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>
            {error?.message || 'Could not fetch on-chain data. Check your connection.'}
          </p>
          <button className="btn btn-sm" onClick={() => window.location.reload()}>
            <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 8a5 5 0 1 1-1.5-3.5M13 3v2.5h-2.5" />
            </svg>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const pos = summary.totalPnl >= 0;

  return (
    <>
      <div className="glass" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74" />
              <path d="M21 3v6h-6" />
              <path d="M12 7v5l3 3" />
            </svg>
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Portfolio</span>
          </div>
          <button className="btn btn-sm" onClick={() => setShowAddModal(true)}>
            <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M8 3v10M3 8h10" />
            </svg>
            Add Token
          </button>
        </div>

        <div className="glass-deep portfolio-summary" style={{ padding: 16, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 18 }}>
          <AllocationChart data={allocations} totalValue={summary.totalValue} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="eyebrow" style={{ marginBottom: 4 }}>Total Value</div>
            <div className="num" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>
              ${summary.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
              <span
                className="num"
                style={{
                  color: pos ? 'var(--color-bullish)' : 'var(--color-bearish)',
                  display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 500, fontSize: 12,
                }}
              >
                {pos ? (
                  <svg width={9} height={9} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v8M3 5l3-3 3 3" /></svg>
                ) : (
                  <svg width={9} height={9} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 10V2M3 7l3 3 3-3" /></svg>
                )}
                {Math.abs(summary.totalPnlPercent).toFixed(2)}%
              </span>
              <span className="num" style={{ fontSize: 11, color: pos ? 'var(--color-bullish)' : 'var(--color-bearish)' }}>
                {pos ? '+' : ''}{formatCurrency(summary.totalPnl)}
              </span>
              <span style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>all-time</span>
            </div>
            <div className="div-h" style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-text-muted)' }}>
              <span>{allTokens.length} holdings</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span className="dot dot-live" /> Auto-refresh
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Holdings</div>
          {allTokens.map((token, i) => (
            <div key={token.address}>
              <TokenRow
                token={token}
                totalValue={summary.totalValue}
                onRemove={token.isManual ? handleRemoveToken : undefined}
              />
              {i < allTokens.length - 1 && <div className="div-h" />}
            </div>
          ))}
        </div>
      </div>

      <AddTokenModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddToken}
      />
    </>
  );
}
