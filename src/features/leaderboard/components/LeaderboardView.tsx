import { useState, useEffect, useCallback } from 'react';
import { Skeleton } from '@/shared/components';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { LeaderboardFilters } from './LeaderboardFilters';
import { TraderCard } from './TraderCard';
import { TraderDetailModal } from './TraderDetailModal';
import { Pagination } from './Pagination';
import type { TraderCard as TraderCardType } from '@/shared/types';

const ITEMS_PER_PAGE = 10;

function TraderCardSkeleton() {
  return (
    <div className="glass" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Skeleton variant="circular" width={36} height={36} />
        <div style={{ flex: 1 }}>
          <Skeleton width="60%" height={12} />
          <div style={{ marginTop: 6 }}>
            <Skeleton width="40%" height={9} />
          </div>
        </div>
        <Skeleton width={42} height={18} />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <Skeleton width={90} height={26} />
        <Skeleton width={100} height={36} />
      </div>
      <div className="div-h" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton width="60%" height={8} />
            <div style={{ marginTop: 6 }}>
              <Skeleton width="80%" height={12} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LeaderboardView() {
  const {
    traders,
    status,
    error,
    sortField,
    sortDirection,
    timeframe,
    handleSort,
    setTimeframe,
    setSearchQuery,
    reload,
  } = useLeaderboard();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrader, setSelectedTrader] = useState<TraderCardType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalPages = Math.ceil(traders.length / ITEMS_PER_PAGE);
  const paginatedTraders = traders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Reset to page 1 when filters/sort/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortField, sortDirection, timeframe]);

  // Also reset when traders list changes (search filter)
  useEffect(() => {
    if (currentPage > Math.ceil(traders.length / ITEMS_PER_PAGE)) {
      setCurrentPage(1);
    }
  }, [traders.length, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    document.getElementById('section-leaderboard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleTraderClick = useCallback((trader: TraderCardType) => {
    setSelectedTrader(trader);
    setIsModalOpen(true);
  }, []);

  const paginationProps = {
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
    totalItems: traders.length,
    itemsPerPage: ITEMS_PER_PAGE,
  };

  return (
    <section>
      <div className="section-head">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 3h6v3a3 3 0 1 1-6 0V3z" />
              <path d="M11 4h2v1a2 2 0 0 1-2 2M5 4H3v1a2 2 0 0 0 2 2M6 13h4M8 9v4" />
            </svg>
            <div className="section-title">Trader Leaderboard</div>
            <span className="pill pill-active">
              <span className="dot dot-live" /> Live
            </span>
          </div>
          <div className="section-sub" style={{ marginTop: 4 }}>
            Ranked by ROI &middot; {traders.length} traders &middot; powered by CoinGecko
          </div>
        </div>
      </div>

      <LeaderboardFilters
        sortField={sortField}
        sortDirection={sortDirection}
        timeframe={timeframe}
        onSort={handleSort}
        onTimeframeChange={setTimeframe}
        onSearch={setSearchQuery}
      />

      {status === 'loading' && (
        <div className="leaderboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {Array.from({ length: 6 }).map((_, i) => <TraderCardSkeleton key={i} />)}
        </div>
      )}

      {status === 'error' && (
        <div className="glass" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{
            width: 50, height: 50, margin: '0 auto 12px',
            borderRadius: 12, background: 'rgba(255,87,87,0.10)',
            border: '1px solid rgba(255,87,87,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-bearish)',
          }}>
            <svg width={22} height={22} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M8 4v4M8 11v.5" />
              <circle cx="8" cy="8" r="6" />
            </svg>
          </div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Failed to load leaderboard</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4, marginBottom: 16 }}>
            {error || 'CoinGecko rate limit reached. Retrying with exponential backoff.'}
          </div>
          <button className="btn" onClick={reload}>
            <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 8a5 5 0 1 1-1.5-3.5M13 3v2.5h-2.5" />
            </svg>
            Retry now
          </button>
        </div>
      )}

      {status === 'success' && traders.length === 0 && (
        <div className="glass" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{
            width: 50, height: 50, margin: '0 auto 12px',
            borderRadius: 12, background: 'rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text-muted)',
          }}>
            <svg width={22} height={22} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="7" cy="7" r="4.5" />
              <path d="m13 13-2.6-2.6" />
            </svg>
          </div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>No traders found</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            Try adjusting your search or filters.
          </div>
        </div>
      )}

      {status === 'success' && traders.length > 0 && (
        <>
          <Pagination {...paginationProps} />

          <div className="leaderboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {paginatedTraders.map((trader, index) => (
              <TraderCard
                key={trader.id}
                trader={trader}
                rank={(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                timeframe={timeframe}
                onClick={handleTraderClick}
              />
            ))}
          </div>

          <Pagination {...paginationProps} />
        </>
      )}

      <TraderDetailModal
        trader={selectedTrader}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
