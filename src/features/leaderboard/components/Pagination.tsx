import { useMemo } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | 'ellipsis')[] = [1];

  if (current > 3) pages.push('ellipsis');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('ellipsis');

  if (total > 1) pages.push(total);

  return pages;
}

export function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }: PaginationProps) {
  const pages = useMemo(() => getPageNumbers(currentPage, totalPages), [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  const from = (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 0', gap: 12, flexWrap: 'wrap',
    }}>
      <span className="num" style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
        {from}–{to} of {totalItems}
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: currentPage === 1 ? 'transparent' : 'rgba(255,255,255,0.03)',
            color: currentPage === 1 ? 'var(--color-text-faint)' : 'var(--color-text-muted)',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            transition: 'all 160ms',
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
              e.currentTarget.style.borderColor = 'var(--color-border-strong)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = currentPage === 1 ? 'transparent' : 'rgba(255,255,255,0.03)';
            e.currentTarget.style.borderColor = 'var(--color-border)';
          }}
        >
          <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="m10 4-4 4 4 4" />
          </svg>
        </button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e${i}`} style={{
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, color: 'var(--color-text-dim)',
              letterSpacing: '0.1em',
            }}>
              ···
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              style={{
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 8,
                border: currentPage === p ? 'none' : '1px solid var(--color-border)',
                background: currentPage === p ? 'var(--gradient-accent)' : 'rgba(255,255,255,0.03)',
                color: currentPage === p ? '#021018' : 'var(--color-text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                fontWeight: currentPage === p ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 160ms',
                boxShadow: currentPage === p ? '0 2px 8px -2px rgba(10,196,136,0.4)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (currentPage !== p) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.borderColor = 'var(--color-border-strong)';
                  e.currentTarget.style.color = 'var(--color-text)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== p) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.color = 'var(--color-text-muted)';
                }
              }}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: currentPage === totalPages ? 'transparent' : 'rgba(255,255,255,0.03)',
            color: currentPage === totalPages ? 'var(--color-text-faint)' : 'var(--color-text-muted)',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            transition: 'all 160ms',
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
              e.currentTarget.style.borderColor = 'var(--color-border-strong)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = currentPage === totalPages ? 'transparent' : 'rgba(255,255,255,0.03)';
            e.currentTarget.style.borderColor = 'var(--color-border)';
          }}
        >
          <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 4 4 4-4 4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
