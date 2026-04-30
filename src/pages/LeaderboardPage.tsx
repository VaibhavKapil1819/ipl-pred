// src/pages/LeaderboardPage.tsx
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
  const [playerStats, setPlayerStats] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [feedFilters, setFeedFilters] = useState({ team: '', player: '', status: 'completed' });

  useEffect(() => {
<<<<<<< Updated upstream
    const unsub = onValue(ref(db, 'matches'), (snap) => {
      const data = snap.val() || {};
      const matchList = Object.entries(data)
        .map(([id, m]: [string, any]) => ({ ...m, id }))
        .sort((a, b) => (a.ts || 0) - (b.ts || 0));

      setMatches(matchList);
      setPlayerStats(calculateStats(matchList));
      setLoading(false);
=======
    const matchesRef = ref(db, 'matches');

    const unsubscribe = onValue(matchesRef, (snap) => {
      const data = snap.val() || {};
      const list = Object.entries(data).map(([id, m]: any) => ({ ...m, id }));

      const asc = [...list].sort((a, b) => (a.ts || 0) - (b.ts || 0));

      setMatches(list);
      setPlayerStats(calculateStats(asc));
>>>>>>> Stashed changes
    });

    return () => unsubscribe();
  }, []);

<<<<<<< Updated upstream
  if (loading) return <div className="no-matches">Loading leaderboard...</div>;

  const sortedPlayers = [...PLAYERS].sort((a, b) => (playerStats[b.id]?.points || 0) - (playerStats[a.id]?.points || 0));

  // Filter Prediction Feed
  const filteredFeed = matches.filter((m: any) => {
    // Status Filter
    const isCompleted = !!m.winner;
    if (feedFilters.status === 'upcoming' && isCompleted) return false;
    if (feedFilters.status === 'completed' && !isCompleted) return false;

    // Team Filter
    if (feedFilters.team && m.team1 !== feedFilters.team && m.team2 !== feedFilters.team) return false;

    // Player Filter
    if (feedFilters.player) {
      const hasPred = m.preds && m.preds[feedFilters.player];
      if (!hasPred) return false;
    }

    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Trophy color="var(--orange)" size={24} />
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '28px', letterSpacing: '2px' }}>Championship Standings</h2>
        </div>
        <ExportTools points={Object.fromEntries(Object.entries(playerStats).map(([id, s]) => [id, s.points]))} />
      </div>

      <div id="leaderboard-section">
        <div className="scoreboard">
          {sortedPlayers.map((p, i) => {
            const s = playerStats[p.id] || {};
            const isLeader = i === 0 && s.points > 0;
            const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32', 'var(--txt2)'];
            
            return (
              <div key={p.id} className={`score-card ${isLeader ? 'leader' : ''}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <div className="sc-main">
                    <div className="rank-badge">{i + 1}</div>
                    <div className="sc-avatar" style={{ background: p.bg, color: p.color }}>{p.short}</div>
                    <div className="sc-name">{p.name}</div>
                  </div>
                  
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-lbl">Record</span>
                      <span className="stat-val">{s.right}-{s.wrong}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-lbl">Streak</span>
                      <span className="stat-val" style={{ color: s.currentStreak > 1 ? 'var(--green)' : s.currentLosingStreak > 1 ? 'var(--red)' : 'inherit' }}>
                        {s.currentStreak > 0 ? `${s.currentStreak}W` : s.currentLosingStreak > 0 ? `${s.currentLosingStreak}L` : '—'}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-lbl">Best</span>
                      <span className="stat-val" style={{ color: 'var(--green)' }}>{s.bestStreak}W</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div className="form-pips">
                    {s.form?.map((result: string, idx: number) => (
                      <div key={idx} className={`pip ${result}`} title={result} />
                    ))}
                  </div>
                  
                  <div className="sc-pts" style={{ color: i < 3 ? rankColors[i] : 'inherit' }}>
                    {s.points}<small style={{ fontSize: '12px', marginLeft: '4px' }}>pts</small>
                  </div>
                </div>
              </div>
            );
          })}
=======
  const sorted = [...PLAYERS].sort(
    (a, b) =>
      (playerStats[b.id]?.points || 0) -
      (playerStats[a.id]?.points || 0)
  );

  const filteredFeed = [...matches].sort((a, b) => (b.ts || 0) - (a.ts || 0));

  return (
    <div className="page">

      <style>{`
        .page {
          max-width: 1000px;
          margin: 0 auto;
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
          line-height: 1;
        }

        .title h2 {
          margin: 0;
        }

        .table {
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
        }

              .row {
        display: grid;
        grid-template-columns: 
          35px 
          auto   /* 🔥 FIXED */
          70px 
          55px 
          65px 
          130px 
          55px 
          55px;

        column-gap: 6px;
        padding: 10px 12px;
        align-items: center;
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
          gap: 6px; /* 🔥 tighter */
        }

        .avatar {
          width: 26px;
          height: 26px;
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
          gap: 5px;
          justify-content: center;
        }

        .form-circle {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
        }

        .win { background: #22c55e; }
        .loss { background: #ef4444; }

        .points {
          font-weight: bold;
          text-align: center;
        }
      `}</style>

      {/* HEADER */}
      <div className="header">
        <div className="title">
          <Trophy size={20} />
          <h2>Standings</h2>
        </div>

        <ExportTools />
      </div>

      {/* TABLE */}
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

      {/* 🔥 PREDICTION FEED */}
      <div style={{ marginTop: '60px', paddingTop: '12px' }}>

        <div className="title" style={{ marginBottom: '14px' }}>
          <Calendar size={16} />
          <h3>Prediction Feed</h3>
>>>>>>> Stashed changes
        </div>

        <div className="section-title">League Performance Detail</div>
        <div className="perf-table-container">
          <table className="perf-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>Accuracy</th>
                <th>Hot/Cold Streak</th>
                <th>Record (W-L)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map(p => {
                const s = playerStats[p.id] || {};
                const isHot = s.currentStreak >= 2;
                const isCold = s.currentLosingStreak >= 2;
                
                return (
                   <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color, boxShadow: `0 0 10px ${p.color}` }}></div>
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--green)' }}>{s.accuracy}%</span>
                        <div className="progress-container">
                          <div className="progress-bar" style={{ width: `${s.accuracy}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {isHot ? (
                        <div className="streak-pill hot">🔥 {s.currentStreak}W STREAK</div>
                      ) : isCold ? (
                        <div className="streak-pill cold">❄️ {s.currentLosingStreak}L STREAK</div>
                      ) : (
                        <span style={{ color: 'var(--txt2)', fontSize: '11px' }}>Steady</span>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      <span style={{ color: 'var(--green)' }}>{s.right}</span>
                      <span style={{ margin: '0 4px', color: 'var(--txt2)' }}>-</span>
                      <span style={{ color: 'var(--red)' }}>{s.wrong}</span>
                    </td>
                    <td style={{ color: 'var(--txt2)', fontWeight: 500 }}>{s.total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

<<<<<<< Updated upstream
        <div style={{ marginTop: '40px', borderTop: '2px dashed var(--bdr)', paddingTop: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingLeft: '10px' }}>
            <Calendar color="var(--orange)" size={20} />
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '22px', letterSpacing: '1px', margin: 0 }}>Prediction Feed</h3>
          </div>
          
          <FilterBar onFilterChange={setFeedFilters} activeFilters={feedFilters} />

          <div className="matches-list">
            {filteredFeed.length === 0 ? (
              <div className="no-matches" style={{ padding: '30px', opacity: 0.5 }}>No matches match these filters.</div>
            ) : (
              filteredFeed.map((m: any) => (
                <MatchCard key={m.id} match={m} />
              ))
            )}
          </div>
        </div>
=======
        <div style={{ marginTop: '14px' }}>
          {filteredFeed.map((m: any, idx: number) => (
            <MatchCard key={m.id} match={m} isLatest={idx === 0} />
          ))}
        </div>

>>>>>>> Stashed changes
      </div>

      <div className="section-title" style={{ marginTop: '30px' }}>Rules of Play</div>
      <div className="form-card" style={{ fontSize: '13px', color: 'var(--txt2)', lineHeight: '1.6' }}>
        <ul style={{ paddingLeft: '20px' }}>
          <li><strong>Points:</strong> +2 for every correct winner prediction.</li>
          <li><strong>Streaks:</strong> Correct picks build Win Streaks (W). Wrong picks build Losing Streaks (L).</li>
          <li><strong>Accuracy:</strong> Calculated based on matches you actually predicted.</li>
        </ul>
      </div>
    </div>
  );
};

export default LeaderboardPage;
