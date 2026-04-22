import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';
import FilterBar from '../components/Shared/FilterBar';
import MatchCard from '../components/Matches/MatchCard';
import { Calendar } from 'lucide-react';
import { calculateStats } from '../lib/stats';

const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [playerStats, setPlayerStats] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ team: '', player: '', status: 'upcoming' });

  useEffect(() => {
    const unsub = onValue(ref(db, 'matches'), (snap) => {
      const data = snap.val() || {};
      const matchList = Object.entries(data)
        .map(([id, m]: [string, any]) => ({ ...m, id }))
        .sort((a, b) => (b.ts || 0) - (a.ts || 0));
      
      setMatches(matchList);
      setPlayerStats(calculateStats(matchList));
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <div className="no-matches">Loading match schedule...</div>;

  const filteredMatches = matches.filter((m: any) => {
    // Status Filter
    const isCompleted = !!m.winner;
    if (filters.status === 'upcoming' && isCompleted) return false;
    if (filters.status === 'completed' && !isCompleted) return false;

    // Team Filter
    if (filters.team && m.team1 !== filters.team && m.team2 !== filters.team) return false;

    // Player Filter
    if (filters.player) {
      const hasPred = m.preds && m.preds[filters.player];
      if (!hasPred) return false;
    }

    return true;
  });

  return (
    <div className="matches-feed">
      <div className="section-title">
        <Calendar color="var(--orange)" size={28} />
        IPL 2026 Prediction Feed
      </div>

      <FilterBar onFilterChange={setFilters} activeFilters={filters} />

      <div className="matches-list">
        {filteredMatches.length === 0 ? (
          <div className="no-matches" style={{ padding: '40px', background: 'var(--bg2)', borderRadius: '12px', border: '1px dashed var(--bdr)' }}>
            <Calendar size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p>No matches found matching these filters.</p>
          </div>
        ) : (
          filteredMatches.map((m: any) => (
            <MatchCard key={m.id} match={m} playerStats={playerStats} />
          ))
        )}
      </div>
    </div>
  );
};

export default MatchesPage;
