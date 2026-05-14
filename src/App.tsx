import { ErrorBoundary } from '@/shared/components';
import { ToastStack } from '@/shared/components/ToastStack';
import { WalletPanel } from '@/features/wallet/components';
import { PriceTicker } from '@/features/ticker/components';
import { LeaderboardView } from '@/features/leaderboard/components';
import { PortfolioView } from '@/features/portfolio/components';
import { Header } from '@/app/Header';

export function App() {
  return (
    <>
      <Header />
      <ToastStack />

      <main style={{ maxWidth: 1440, margin: '0 auto', padding: '0 28px 60px' }}>
        <div id="section-ticker">
          <ErrorBoundary moduleName="Price Ticker">
            <PriceTicker />
          </ErrorBoundary>
        </div>

        <div className="layout-main" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'flex-start' }}>
          <div id="section-leaderboard" style={{ minWidth: 0 }}>
            <ErrorBoundary moduleName="Leaderboard">
              <LeaderboardView />
            </ErrorBoundary>
          </div>

          <div className="right-col" style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'sticky', top: 80 }}>
            <ErrorBoundary moduleName="Wallet">
              <WalletPanel />
            </ErrorBoundary>
            <div id="section-portfolio">
              <ErrorBoundary moduleName="Portfolio">
                <PortfolioView />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
