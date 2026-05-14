import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from '@/stores/toastStore';

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (token: { symbol: string; balance: number; entryPrice: number; address: string }) => void;
}

export function AddTokenModal({ isOpen, onClose, onAdd }: AddTokenModalProps) {
  const [addr, setAddr] = useState('');
  const [sym, setSym] = useState('');
  const [bal, setBal] = useState('');
  const [entry, setEntry] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setAddr('');
      setSym('');
      setBal('');
      setEntry('');
    }
  }, [isOpen]);

  const valid = sym.trim() && bal && !isNaN(parseFloat(bal)) && entry && !isNaN(parseFloat(entry));

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!valid) return;
    onAdd({
      symbol: sym.trim().toUpperCase(),
      balance: parseFloat(bal),
      entryPrice: parseFloat(entry),
      address: addr.trim() || `mock-${sym.trim().toLowerCase()}-${Date.now()}`,
    });
    toast.success(`${sym.trim().toUpperCase()} added to portfolio`, 'Token Added');
    onClose();
  };

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()} style={{ width: 440, padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Add Token</div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ width: 28, padding: 0, justifyContent: 'center' }}>
            <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="m4 4 8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>
        <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 18 }}>
          Manually add a token not auto-detected from your wallet. Persists to <span className="num" style={{ color: 'var(--color-text)' }}>localStorage</span>.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: 6 }}>Contract address</label>
            <input className="input" placeholder="0x..." value={addr} onChange={(e) => setAddr(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="eyebrow" style={{ display: 'block', marginBottom: 6 }}>Symbol</label>
              <input
                className="input"
                placeholder="e.g. UNI"
                value={sym}
                onChange={(e) => setSym(e.target.value.toUpperCase())}
                maxLength={10}
                autoFocus
              />
            </div>
            <div>
              <label className="eyebrow" style={{ display: 'block', marginBottom: 6 }}>Balance</label>
              <input className="input num" placeholder="0.0" value={bal} onChange={(e) => setBal(e.target.value)} type="number" step="any" min="0" />
            </div>
          </div>
          <div>
            <label className="eyebrow" style={{ display: 'block', marginBottom: 6 }}>Mock entry price (USD)</label>
            <input className="input num" placeholder="0.00" value={entry} onChange={(e) => setEntry(e.target.value)} type="number" step="any" min="0" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          <button className="btn" style={{ flex: 1, height: 40 }} onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            style={{ flex: 1, height: 40, opacity: valid ? 1 : 0.5, cursor: valid ? 'pointer' : 'not-allowed' }}
            onClick={handleSubmit}
            disabled={!valid}
          >
            <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M8 3v10M3 8h10" />
            </svg>
            Add to portfolio
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
