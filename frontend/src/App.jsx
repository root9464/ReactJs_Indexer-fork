import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BottomNavBar from './components/BottomNavBar';
import WorkInProgress from './components/WorkInProgress';
import ExplorePage from './pages/ExplorePage';
import PortfolioPage from './pages/PortfolioPage';
import IndexesPage from './pages/IndexesPage'
import './styles/index.css';

function App() {
  return (
          <Router>
            <div className="min-h-screen bg-white pb-16">
              <Routes>
                <Route path="/" element={<Navigate to="/explore" replace />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/market" element={<WorkInProgress />} />
                <Route path="/indexes" element={<IndexesPage />} />
                <Route path="/gainers" element={<WorkInProgress />} />
                <Route path="/losers" element={<WorkInProgress />} />
                <Route path="/resale" element={<WorkInProgress />} />
                <Route path="/pulse" element={<WorkInProgress />} />
              </Routes>
              <BottomNavBar />
            </div>
          </Router>

  );
}

export default App;
