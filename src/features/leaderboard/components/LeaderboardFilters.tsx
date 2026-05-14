import { useState, useEffect, useMemo } from 'react';
import { TIMEFRAMES, SEARCH_DEBOUNCE_MS } from '@/config/constants';
import { debounce } from '@/shared/utils/debounce';
import { useLeaderboardStore } from '@/stores/leaderboardStore';
import type { SortField, SortDirection, Timeframe } from '@/shared/types';

interface LeaderboardFiltersProps {
  sortField: SortField;
  sortDirection: SortDirection;
  timeframe: Timeframe;
  onSort: (field: SortField) => void;
  onTimeframeChange: (tf: Timeframe) => void;
  onSearch: (query: string) => void;
}

const SORT_OPTIONS: { field: SortField; label: string }[] = [
  { field: 'roi', label: 'ROI %' },
  { field: 'pnl', label: 'PNL $' },
  { field: 'volume', label: 'Volume' },
];

export function LeaderboardFilters({
  sortField,
  sortDirection,
  timeframe,
  onSort,
  onTimeframeChange,
  onSearch,
}: LeaderboardFiltersProps) {
  const [inputValue, setInputValue] = useState('');

  const debouncedSearch = useMemo(
    () => debounce((value: string) => onSearch(value), SEARCH_DEBOUNCE_MS),
    [onSearch],
  );

  useEffect(() => {
    debouncedSearch(inputValue);
  }, [inputValue, debouncedSearch]);

  // Sync with external search changes (from header search bar)
  const storeQuery = useLeaderboardStore((s) => s.searchQuery);
  useEffect(() => {
    if (storeQuery !== inputValue) {
      setInputValue(storeQuery);
    }
    // Intentionally omit inputValue from deps — only sync when the store
    // value changes externally (e.g. header search). Including inputValue
    // would cause an infinite sync loop between local state and store.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeQuery]);

  return (
    <div className="glass" style={{ padding: 14, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <div className="input" style={{ flex: '1 1 240px', display: 'flex', alignItems: 'center', gap: 8, height: 34 }}>
        <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7" cy="7" r="4.5" />
          <path d="m13 13-2.6-2.6" />
        </svg>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search by name or address..."
          style={{ background: 'transparent', border: 'none', color: 'inherit', flex: 1, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
        />
        {inputValue && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setInputValue('')}
            style={{ width: 20, height: 20, padding: 0, justifyContent: 'center' }}
          >
            <svg width={10} height={10} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="m4 4 8 8M12 4l-8 8" />
            </svg>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="eyebrow">Timeframe</span>
        <div style={{ display: 'inline-flex', padding: 3, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', borderRadius: 8 }}>
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              style={{
                padding: '6px 12px',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                fontWeight: 500,
                color: timeframe === tf ? '#021018' : 'var(--color-text-muted)',
                background: timeframe === tf ? 'var(--gradient-accent)' : 'transparent',
                border: 'none',
                borderRadius: 5,
                cursor: 'pointer',
                transition: 'all 160ms',
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="eyebrow">Sort</span>
        <div style={{ display: 'inline-flex', padding: 3, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', borderRadius: 8, gap: 2 }}>
          {SORT_OPTIONS.map(({ field, label }) => {
            const active = sortField === field;
            return (
              <button
                key={field}
                onClick={() => onSort(field)}
                style={{
                  padding: '6px 10px',
                  fontSize: 11,
                  fontWeight: 500,
                  color: active ? 'var(--color-text)' : 'var(--color-text-muted)',
                  background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                  border: 'none',
                  borderRadius: 5,
                  cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}
              >
                {label}
                {active && (
                  <svg width={10} height={10} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: sortDirection === 'asc' ? 'rotate(180deg)' : 'none' }}>
                    <path d="m4 6 4 4 4-4" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
