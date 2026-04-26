import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { Trophy, Calendar } from 'lucide-react';
import ExportTools from '../components/Shared/ExportTools';
import MatchCard from '../components/Matches/MatchCard';
import FilterBar from '../components/Shared/FilterBar';
import { calculateStats } from '../lib/stats';
import { PLAYERS } from '../lib/firebase';

const LeaderboardPage: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [playerStats, setPlayerStats] = useState<any>({});
  const [feedFilters, setFeedFilters] = useState({
    team: '',
    player: '',
    status: 'completed'
  });

  useEffect(() => {
    const unsub = onValue(ref(db, 'matches'), (snap) => {
      const data = snap.val() || {};

      // ✅ IMPORTANT: keep ASC for stats
      const list = Object.entries(data)
        .map(([id, m]: any) => ({ ...m, id }))
        .sort((a, b) => (a.ts || 0) - (b.ts || 0));

      setMatches(list);
      setPlayerStats(calculateStats(list));
    });

    return () => unsub();
  }, []);

  // ✅ leaderboard sorting
  const sorted = [...PLAYERS].sort(
    (a, b) =>
      (playerStats[b.id]?.points || 0) -
      (playerStats[a.id]?.points || 0)
  );

  // 🔥 MAIN FIX: latest first for feed
  const filteredFeed = [...matches]
    .sort((a, b) => (b.ts || 0) - (a.ts || 0))
    .filter((m: any) => {
      const isCompleted = !!m.winner;

      if (feedFilters.status === 'upcoming' && isCompleted) return false;
      if (feedFilters.status === 'completed' && !isCompleted) return false;

      if (
        feedFilters.team &&
        m.team1 !== feedFilters.team &&
        m.team2 !== feedFilters.team
      ) return false;

      if (
        feedFilters.player &&
        !(m.preds && m.preds[feedFilters.player])
      ) return false;

      return true;
    });

  return (
    <div className="page">

      {/* CSS */}
      <style>{`
        .page {
          max-width: 1100px;
          margin: auto;
          padding: 12px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .table {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .row {
          display: grid;
          grid-template-columns: 40px 1.5fr 100px 80px 100px 160px 100px;
          align-items: center;
          padding: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: #0f172a;
        }

        .header-row {
          background: #020617;
          font-size: 11px;
          color: #94a3b8;
          font-weight: 600;
        }

        .data-row:hover {
          background: #1e293b;
        }

        .name-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
        }

        .avatar {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: bold;
        }

        .form {
          display: flex;
          gap: 6px;
        }

        .form-circle {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }

        .win {
          background: #22c55e;
          color: white;
        }

        .loss {
          background: #ef4444;
          color: white;
        }

        .latest {
          box-shadow: 0 0 0 2px white, 0 0 8px currentColor;
        }

        .points {
          font-weight: bold;
          font-size: 14px;
        }

        @media(max-width: 800px){
          .row {
            grid-template-columns: 30px 1fr 70px 60px 70px 140px 70px;
            font-size: 11px;
          }

          .form-circle {
            width: 18px;
            height: 18px;
            font-size: 10px;
          }
        }
      `}</style>

      {/* HEADER */}
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Trophy size={20} />
          <h2>Standings</h2>
        </div>

        <ExportTools
          points={Object.fromEntries(
            Object.entries(playerStats).map(([id, s]) => [id, s.points])
          )}
        />
      </div>

      {/* TABLE */}
      <div className="table">

        <div className="row header-row">
          <div>#</div>
          <div>Player</div>
          <div>W-L</div>
          <div>Total</div>
          <div>Accuracy</div>
          <div>Form</div>
          <div>Points</div>
        </div>

        {sorted.map((p, i) => {
          const s = playerStats[p.id] || {};
          const last5 = s.form?.slice(-5) || [];

          return (
            <div key={p.id} className="row data-row">
              
              <div>{i + 1}</div>

              <div className="name-cell">
                <div className="avatar" style={{ background: p.bg, color: p.color }}>
                  {p.short}
                </div>
                {p.name}
              </div>

              <div>{s.right}-{s.wrong}</div>
              <div>{s.total}</div>
              <div>{s.accuracy}%</div>

              <div className="form">
                {last5.map((r: string, idx: number) => {
                  const isLast = idx === last5.length - 1;

                  return (
                    <div
                      key={idx}
                      className={`form-circle ${r === 'W' ? 'win' : 'loss'} ${isLast ? 'latest' : ''}`}
                    >
                      {r === 'W' ? '✓' : '✕'}
                    </div>
                  );
                })}
              </div>

              <div className="points">{s.points}</div>
            </div>
          );
        })}
      </div>

      {/* FEED */}
      <div style={{ marginTop: '25px' }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
          <Calendar size={16} />
          <h3>Prediction Feed</h3>
        </div>

        <FilterBar
          onFilterChange={setFeedFilters}
          activeFilters={feedFilters}
        />

        {filteredFeed.map((m: any, idx: number) => (
          <MatchCard
            key={m.id}
            match={m}
            isLatest={idx === 0} // 🔥 optional highlight
          />
        ))}
      </div>

    </div>
  );
};

export default LeaderboardPage;