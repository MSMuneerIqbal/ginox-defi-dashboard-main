import { useToastStore } from '@/stores/toastStore';

export function ToastStack() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          <div
            className="toast-icon"
            style={{
              background:
                t.type === 'success' ? 'rgba(10,196,136,0.18)' :
                t.type === 'error' ? 'rgba(255,87,87,0.18)' :
                'rgba(51,160,234,0.18)',
              color:
                t.type === 'success' ? 'var(--color-bullish)' :
                t.type === 'error' ? 'var(--color-bearish)' :
                '#33A0EA',
            }}
          >
            {t.type === 'success' ? (
              <svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 8 3.5 3.5L13 5" /></svg>
            ) : t.type === 'error' ? (
              <svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="m4 4 8 8M12 4l-8 8" /></svg>
            ) : (
              <svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M8 3v6M8 11.5v.5" /></svg>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {t.title && <div style={{ fontWeight: 500, marginBottom: 2 }}>{t.title}</div>}
            <div style={{ color: t.title ? 'var(--color-text-muted)' : 'var(--color-text)' }}>{t.message}</div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => dismiss(t.id)}
            style={{ width: 22, height: 22, padding: 0, justifyContent: 'center' }}
          >
            <svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="m4 4 8 8M12 4l-8 8" /></svg>
          </button>
        </div>
      ))}
    </div>
  );
}
