import React, { useState } from 'react';
import { useMatches } from '../context/MatchContext';
import FilterBar from '../components/Shared/FilterBar';
import MatchCard from '../components/Matches/MatchCard';
import { Calendar } from 'lucide-react';

const MatchesPage: React.FC = () => {
  const { matches, playerStats, loading } = useMatches();

  const [filters, setFilters] = useState({
    team: '',
    player: '',
    status: 'upcoming'
  });

  if (loading) {
    return (
      <div style={styles.centerBox}>
        Loading match schedule...
      </div>
    );
  }

  /* ===== FILTER LOGIC ===== */
  const filteredMatches = matches.filter((m: any) => {
    const isCompleted = !!m.winner;

    // status
    if (filters.status === 'upcoming' && isCompleted) return false;
    if (filters.status === 'completed' && !isCompleted) return false;

    // team
    if (
      filters.team &&
      m.team1 !== filters.team &&
      m.team2 !== filters.team
    ) return false;

    // player
    if (filters.player) {
      const hasPred = m.preds && m.preds[filters.player];
      if (!hasPred) return false;
    }

    return true;
  });

  return (
    <div style={styles.page}>
      {/* TITLE */}
      <div style={styles.title}>
        <Calendar color="#f97316" size={26} />
        IPL 2026 Prediction Feed
      </div>

      {/* FILTER */}
      <FilterBar
        onFilterChange={setFilters}
        activeFilters={filters}
      />

      {/* MATCH LIST */}
      <div style={styles.list}>
        {filteredMatches.length === 0 ? (
          <div style={styles.noData}>
            <Calendar size={32} style={{ opacity: 0.3 }} />
            <p>No matches found matching these filters.</p>
          </div>
        ) : (
          filteredMatches.map((m: any, i: number) => (
            <MatchCard
              key={m.id || i}
              match={m}
              playerStats={playerStats}
              isLatest={i === filteredMatches.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MatchesPage;

/* ================= STYLES ================= */

const styles: any = {
  page: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px'
  },

  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '16px'
  },

  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },

  noData: {
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
    background: '#0f172a',
    border: '1px dashed rgba(255,255,255,0.1)',
    color: '#94a3b8'
  },

  centerBox: {
    padding: '40px',
    textAlign: 'center'
  }
};