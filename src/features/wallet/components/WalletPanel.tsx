import { useState, useEffect, useRef } from 'react';
import { useDisconnect, useAccount } from 'wagmi';
import { Skeleton, TokenIcon } from '@/shared/components';
import { useWalletData } from '../hooks/useWalletData';
import { NetworkBadge } from './NetworkBadge';
import { WrongNetworkBanner } from './WrongNetworkBanner';
import { SignMessageModal } from './SignMessageModal';
import { ConnectWalletModal } from './ConnectWalletModal';
import { useClipboard } from '@/shared/hooks/useClipboard';
import { toast } from '@/stores/toastStore';
import { supportedChains } from '@/config/chains';

export function WalletPanel() {
  const {
    isConnected,
    formattedAddress,
    formattedNativeBalance,
    nativeSymbol,
    usdcBalance,
    isNativeBalanceLoading,
    isUsdcBalanceLoading,
    networkInfo,
    isSwitching,
    handleSwitchChain,
    address,
    chain,
  } = useWalletData();

  const { disconnect } = useDisconnect();
  const { copied, copy } = useClipboard();
  const [showSignModal, setShowSignModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  // Track connection state for toasts
  const prevConnected = useRef(isConnected);
  const { connector } = useAccount();

  useEffect(() => {
    if (isConnected && !prevConnected.current) {
      toast.success(`Connected via ${connector?.name ?? 'wallet'}`, 'Wallet Connected');
    } else if (!isConnected && prevConnected.current) {
      toast.info('Wallet disconnected');
    }
    prevConnected.current = isConnected;
  }, [isConnected, connector]);

  // Detect wrong network (not in supported chains list)
  const isWrongNetwork = isConnected && chain && !supportedChains.some((c) => c.id === chain.id);
  const chainName = chain?.name ?? 'Unknown';

  const handleDisconnect = () => {
    disconnect();
  };

  if (!isConnected) {
    return (
      <div className="glass" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'block' }} aria-hidden="true">
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
          </svg>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Wallet</span>
        </div>
        <div style={{ padding: '16px 0 8px', textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, margin: '0 auto 14px',
            borderRadius: 14,
            background: 'var(--gradient-accent-soft)',
            border: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text-muted)',
          }}>
            <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
            </svg>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>No wallet connected</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4, marginBottom: 16, lineHeight: 1.5 }}>
            Connect a wallet to access on-chain data and sign messages.
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
          <div style={{ marginTop: 12, fontSize: 10, color: 'var(--color-text-dim)', letterSpacing: '0.02em' }}>
            MetaMask &middot; WalletConnect &middot; Coinbase Wallet
          </div>
        </div>
        <ConnectWalletModal isOpen={showConnectModal} onClose={() => setShowConnectModal(false)} />
      </div>
    );
  }

  return (
    <>
      <div className="glass" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
            </svg>
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Wallet</span>
          </div>
          {networkInfo && <NetworkBadge label={networkInfo.label} color={networkInfo.color} />}
        </div>

        {isWrongNetwork && (
          <WrongNetworkBanner
            chainName={chainName}
            targetName="Ethereum"
            onSwitch={() => handleSwitchChain(1)}
            isSwitching={isSwitching}
          />
        )}

        <div className="glass-deep" style={{ padding: 16, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="num" style={{ fontSize: 13, fontWeight: 500 }}>{formattedAddress}</span>
                <button
                  onClick={() => {
                    if (address) {
                      copy(address);
                      toast.success('Address copied to clipboard');
                    }
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{ width: 22, height: 22, padding: 0, justifyContent: 'center' }}
                >
                  {copied ? (
                    <svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 8 3.5 3.5L13 5" /></svg>
                  ) : (
                    <svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="5" width="9" height="9" rx="1.5" /><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" /></svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="div-h" style={{ margin: '0 -16px 12px' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 4 }}>Total Balance</div>
              {isNativeBalanceLoading ? (
                <Skeleton width={120} height={20} />
              ) : (
                <div className="num" style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>
                  {formattedNativeBalance} {nativeSymbol}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TokenIcon symbol={nativeSymbol} size={22} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>{nativeSymbol}</span>
            </div>
            <span className="num" style={{ fontSize: 13, fontWeight: 500 }}>
              {formattedNativeBalance}
            </span>
          </div>
          <div className="div-h" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TokenIcon symbol="USDC" size={22} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>USDC</span>
            </div>
            {isUsdcBalanceLoading ? (
              <Skeleton width={80} height={16} />
            ) : (
              <span className="num" style={{ fontSize: 13, fontWeight: 500 }}>
                {usdcBalance}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button className="btn" style={{ justifyContent: 'center', height: 38 }} onClick={() => setShowSignModal(true)}>
            <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.3 2.3a1.5 1.5 0 0 1 2.1 2.1L6.3 12.5 2.5 13.5l1-3.8z" />
              <path d="M10.2 4.4l2.1 2.1" />
            </svg>
            Sign Message
          </button>
          <button className="btn" style={{ justifyContent: 'center', height: 38, color: 'var(--color-bearish)' }} onClick={handleDisconnect}>
            <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2v6M5 4.5A5 5 0 1 0 11 4.5" />
            </svg>
            Disconnect
          </button>
        </div>
      </div>

      <SignMessageModal isOpen={showSignModal} onClose={() => setShowSignModal(false)} />
    </>
  );
}
