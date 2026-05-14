import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAccount, useSignTypedData } from 'wagmi';
import { useClipboard } from '@/shared/hooks/useClipboard';
import { truncateAddress } from '@/shared/utils/format';
import { EIP712_DOMAIN, EIP712_TYPES, isUserRejectionError } from '../types';
import { toast } from '@/stores/toastStore';
import { NetworkBadge } from './NetworkBadge';

interface SignMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Phase = 'idle' | 'pending' | 'signed' | 'rejected';

export function SignMessageModal({ isOpen, onClose }: SignMessageModalProps) {
  const { address, chain } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const { copied, copy } = useClipboard();

  const [phase, setPhase] = useState<Phase>('idle');
  const [signature, setSignature] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setPhase('idle');
      setSignature(null);
    }
  }, [isOpen]);

  const chainId = chain?.id ?? 1;

  const typedData = {
    domain: {
      name: EIP712_DOMAIN.name,
      version: EIP712_DOMAIN.version,
      chainId,
      verifyingContract: '0x0000000000000000000000000000000000000000' as const,
    },
    types: EIP712_TYPES,
    primaryType: 'Verification' as const,
    message: {
      wallet: address ?? '0x0',
      timestamp: BigInt(Math.floor(Date.now() / 1000)),
      action: 'Verify wallet ownership for Ginox Trading Platform',
    },
  };

  const handleSign = useCallback(async () => {
    if (!address) return;
    setPhase('pending');

    try {
      const sig = await signTypedDataAsync({
        domain: typedData.domain,
        types: typedData.types,
        primaryType: typedData.primaryType,
        message: typedData.message,
      });

      setSignature(sig);
      setPhase('signed');
      toast.success('Message signed successfully', 'Signature');
    } catch (err) {
      if (isUserRejectionError(err)) {
        setPhase('rejected');
        toast.info('Signature request rejected');
      } else {
        setPhase('rejected');
        toast.error('Failed to sign message');
      }
    }
  }, [address, signTypedDataAsync, typedData.domain, typedData.types, typedData.primaryType, typedData.message]);

  const handleReject = () => {
    setPhase('rejected');
  };

  if (!isOpen) return null;

  const networkInfo = chain ? { label: chain.name, color: '#627EEA' } : null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()} style={{ width: 520, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.3 2.3a1.5 1.5 0 0 1 2.1 2.1L6.3 12.5 2.5 13.5l1-3.8z" />
              <path d="M10.2 4.4l2.1 2.1" />
            </svg>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Sign Typed Message</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ width: 28, padding: 0, justifyContent: 'center' }}>
            <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="m4 4 8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>
        <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Cryptographically sign an <span className="num" style={{ color: 'var(--color-text)' }}>EIP-712</span> typed payload. No gas, no transaction.
        </div>

        {/* Typed payload display */}
        <div className="glass-deep" style={{ padding: 14, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span className="eyebrow">Domain</span>
            {networkInfo && <NetworkBadge label={networkInfo.label} color={networkInfo.color} />}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 14px', fontSize: 12 }}>
            <span style={{ color: 'var(--color-text-muted)' }}>name</span>
            <span className="num" style={{ textAlign: 'right' }}>{typedData.domain.name}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>chainId</span>
            <span className="num" style={{ textAlign: 'right' }}>{typedData.domain.chainId}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>version</span>
            <span className="num" style={{ textAlign: 'right' }}>{typedData.domain.version}</span>
          </div>
          <div className="div-h" style={{ margin: '12px -14px' }} />
          <div className="eyebrow" style={{ marginBottom: 10 }}>Message &middot; Verification</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 14px', fontSize: 12 }}>
            <span style={{ color: 'var(--color-text-muted)' }}>wallet</span>
            <span className="num" style={{ textAlign: 'right' }}>{truncateAddress(String(typedData.message.wallet))}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>timestamp</span>
            <span className="num" style={{ textAlign: 'right' }}>{Number(typedData.message.timestamp)}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>action</span>
            <span className="num" style={{ textAlign: 'right', fontSize: 11 }}>{typedData.message.action}</span>
          </div>
        </div>

        {/* Result */}
        {phase === 'signed' && signature && (
          <div style={{
            padding: 12,
            background: 'rgba(10,196,136,0.06)',
            border: '1px solid rgba(10,196,136,0.25)',
            borderRadius: 8,
            marginBottom: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 18, height: 18, borderRadius: 999, background: 'rgba(10,196,136,0.18)', color: 'var(--color-bullish)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 8 3.5 3.5L13 5" /></svg>
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-bullish)' }}>Signature verified</span>
            </div>
            <div className="num" style={{ fontSize: 11, color: 'var(--color-text-muted)', wordBreak: 'break-all', lineHeight: 1.5 }}>
              {signature.slice(0, 66)}&hellip;{signature.slice(-12)}
            </div>
            <button className="btn btn-sm" style={{ marginTop: 8 }} onClick={() => copy(signature)}>
              {copied ? 'Copied' : 'Copy signature'}
            </button>
          </div>
        )}

        {phase === 'rejected' && (
          <div style={{
            padding: 12, marginBottom: 14,
            background: 'rgba(255,87,87,0.07)',
            border: '1px solid rgba(255,87,87,0.25)',
            borderRadius: 8,
            fontSize: 12, color: 'var(--color-bearish)',
          }}>
            Signature request rejected by the user.
          </div>
        )}

        {/* Action buttons */}
        <div className="modal-actions" style={{ display: 'flex', gap: 8 }}>
          {phase === 'signed' ? (
            <button className="btn btn-primary" onClick={onClose} style={{ flex: 1, height: 44 }}>Done</button>
          ) : phase === 'pending' ? (
            <button className="btn btn-primary" disabled style={{ flex: 1, height: 44, opacity: 0.7, cursor: 'wait' }}>
              <span className="dot dot-live" /> Waiting for wallet&hellip;
            </button>
          ) : (
            <>
              <button className="btn" style={{ flex: 1, height: 44 }} onClick={handleReject}>Reject</button>
              <button className="btn btn-primary" style={{ flex: 1, height: 44 }} onClick={handleSign}>
                <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.3 2.3a1.5 1.5 0 0 1 2.1 2.1L6.3 12.5 2.5 13.5l1-3.8z" />
                  <path d="M10.2 4.4l2.1 2.1" />
                </svg>
                Sign
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
