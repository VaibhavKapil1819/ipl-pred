import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { Trophy, Calendar } from 'lucide-react';
import ExportTools from '../components/Shared/ExportTools';
import MatchCard from '../components/Matches/MatchCard';
import FilterBar from '../components/Shared/FilterBar';
import { calculateStats } from '../lib/stats';
import { PLAYERS } from '../lib/firebase';

const getBestStreak = (form: string[] = []) => {
  if (!form.length) return '-';

  let maxW = 0, maxL = 0;
  let curr = form[0], count = 1;

  for (let i = 1; i < form.length; i++) {
    if (form[i] === curr) count++;
    else {
      curr === 'W' ? maxW = Math.max(maxW, count) : maxL = Math.max(maxL, count);
      curr = form[i];
      count = 1;
    }
  }

  curr === 'W' ? maxW = Math.max(maxW, count) : maxL = Math.max(maxL, count);
  return maxW >= maxL ? `${maxW}W` : `${maxL}L`;
};

const LeaderboardPage: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [playerStats, setPlayerStats] = useState<any>({});
  const [feedFilters, setFeedFilters] = useState({
    team: '',
    player: '',
    status: 'completed'
  });

  useEffect(() => {
    const matchesRef = ref(db, 'matches');

    const unsubscribe = onValue(matchesRef, (snap) => {
      const data = snap.val() || {};
      const list = Object.entries(data).map(([id, m]: any) => ({ ...m, id }));

      const asc = [...list].sort((a, b) => (a.ts || 0) - (b.ts || 0));

      setMatches(list);
      setPlayerStats(calculateStats(asc));
    });

    return () => unsubscribe();
  }, []);

  const sorted = [...PLAYERS].sort(
    (a, b) =>
      (playerStats[b.id]?.points || 0) -
      (playerStats[a.id]?.points || 0)
  );

  const filteredFeed = [...matches].sort((a, b) => (b.ts || 0) - (a.ts || 0));

  return (
    <div className="page">

      {/* ===== STYLES ===== */}
      <style>{`
        .page {
          max-width: 1050px;
          margin: auto;
          padding: 20px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .table {
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .row {
          display: grid;
          grid-template-columns:
            40px
            200px
            90px
            70px
            90px
            180px
            80px
            80px;

          align-items: center;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: #0f172a;
        }

        .header-row {
          background: #020617;
          color: #94a3b8;
          font-weight: 600;
          font-size: 12px;
        }

        .data-row:hover {
          background: #1e293b;
        }

        .name-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .avatar {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .center {
          text-align: center;
        }

        .form {
          display: flex;
          gap: 6px;
          justify-content: center;
        }

        .form-circle {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          color: white;
        }

        .win { background: #22c55e; }
        .loss { background: #ef4444; }

        .points {
          font-weight: bold;
          text-align: center;
        }
      `}</style>

      {/* ===== HEADER ===== */}
      <div className="header">
        <div className="title">
          <Trophy size={20} />
          <h2>Standings</h2>
        </div>

        <ExportTools />
      </div>

      {/* ===== TABLE ===== */}
      <div id="leaderboard-section">
        <div className="table">

          <div className="row header-row">
            <div>#</div>
            <div>Player</div>
            <div className="center">W-L</div>
            <div className="center">Total</div>
            <div className="center">Accuracy</div>
            <div className="center">Form</div>
            <div className="center">Best</div>
            <div className="center">Points</div>
          </div>

          {sorted.map((p, i) => {
            const s = playerStats[p.id] || {};
            const last5 = (s.form || []).slice(-5);
            const best = getBestStreak(s.form || []);

            return (
              <div key={p.id} className="row data-row">
                <div>{i + 1}</div>

                <div className="name-cell">
                  <div className="avatar" style={{ background: p.bg }}>
                    {(p as any).emoji || p.short}
                  </div>
                  {p.name}
                </div>

                <div className="center">{s.right}-{s.wrong}</div>
                <div className="center">{s.total}</div>
                <div className="center">{s.accuracy}%</div>

                <div className="form">
                  {last5.map((r: string, idx: number) => (
                    <div key={idx} className={`form-circle ${r === 'W' ? 'win' : 'loss'}`}>
                      {r}
                    </div>
                  ))}
                </div>

                <div className="center">{best}</div>
                <div className="points">{s.points}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== FEED ===== */}
      <div style={{ marginTop: '50px' }}>
        <div className="title" style={{ marginBottom: '12px' }}>
          <Calendar size={16} />
          <h3>Prediction Feed</h3>
        </div>

        <FilterBar
          onFilterChange={setFeedFilters}
          activeFilters={feedFilters}
        />

        <div style={{ marginTop: '12px' }}>
          {filteredFeed.map((m: any, idx: number) => (
            <MatchCard key={m.id} match={m} isLatest={idx === 0} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default LeaderboardPage;