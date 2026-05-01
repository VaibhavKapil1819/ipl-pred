import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { Trophy, Calendar } from 'lucide-react';
import ExportTools from '../components/Shared/ExportTools';
import MatchCard from '../components/Matches/MatchCard';
import FilterBar from '../components/Shared/FilterBar';
import { calculateStats } from '../lib/stats';
import { PLAYERS } from '../lib/firebase';

/* BEST STREAK */
const getBestStreak = (form: string[] = []) => {
  if (!form.length) return '-';

  let maxW = 0, maxL = 0;
  let curr = form[0], count = 1;

  for (let i = 1; i < form.length; i++) {
    if (form[i] === curr) count++;
    else {
      curr === 'W'
        ? (maxW = Math.max(maxW, count))
        : (maxL = Math.max(maxL, count));
      curr = form[i];
      count = 1;
    }
  }

  curr === 'W'
    ? (maxW = Math.max(maxW, count))
    : (maxL = Math.max(maxL, count));

  return maxW >= maxL ? `${maxW}W` : `${maxL}L`;
};

/* FAV PICK */
const getFavPickFromMatches = (matches: any[], playerId: string) => {
  const teamPoints: any = {};

  matches.forEach(m => {
    if (!m.winner) return;

    const pred = m.preds?.[playerId];
    const pick = typeof pred === 'object' ? pred.pick : pred;

    const userPick = pick?.toString().toLowerCase();
    const actualWinner = m.winner?.toString().toLowerCase();

    if (!userPick) return;

    if (userPick === actualWinner) {
      teamPoints[userPick] = (teamPoints[userPick] || 0) + 2;
    }
  });

  let fav = '-';
  let max = 0;

  Object.entries(teamPoints).forEach(([team, pts]: any) => {
    if (pts > max) {
      max = pts;
      fav = team.toUpperCase();
    }
  });

  return fav;
};

const LeaderboardPage: React.FC = () => {
<<<<<<< Updated upstream
  const [matches, setMatches] = useState<any[]>([]);
  const [playerStats, setPlayerStats] = useState<any>({});
=======
  const { matches, playerStats, loading } = useMatches();

>>>>>>> Stashed changes
  const [feedFilters, setFeedFilters] = useState({
    team: '',
    player: '',
    status: 'completed',
  });

<<<<<<< Updated upstream
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
=======
  if (loading) return <div>Loading...</div>;
>>>>>>> Stashed changes

  const sorted = [...PLAYERS].sort(
    (a, b) =>
      (playerStats[b.id]?.points || 0) -
      (playerStats[a.id]?.points || 0)
  );

  const filteredFeed = [...matches].sort(
    (a, b) => (b.ts || 0) - (a.ts || 0)
  );

  return (
    <div className="page">

      <style>{`
        .page { max-width: 900px; margin: auto; padding: 20px; }

        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .table {
          width: 100%;
          max-width: 820px;
          margin: auto;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .row {
          display: grid;
          grid-template-columns:
            28px 140px 80px 60px 80px 80px 120px 70px 70px;
          padding: 10px;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: #0f172a;
        }

        .header-row {
          background: #020617;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 600;
        }

        .name-cell {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .avatar {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .form { display: flex; gap: 4px; justify-content: center; }

        .form-circle {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          font-size: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .win { background: #22c55e; }
        .loss { background: #ef4444; }

        .points { font-weight: bold; }
      `}</style>

      {/* HEADER */}
      <div className="header">
        <div className="title">
          <Trophy size={18} />
          <h2>Standings</h2>
        </div>
        <ExportTools />
      </div>

      {/* 🔥 FIXED EXPORT SECTION */}
      <div id="leaderboard-section">
        <div className="table">

          <div className="row header-row">
            <div>#</div>
            <div>Player</div>
            <div>W-L</div>
            <div>Total</div>
            <div>Accuracy</div>
            <div>Pick</div>
            <div>Form</div>
            <div>Best</div>
            <div>Points</div>
          </div>

          {sorted.map((p, i) => {
            const s = playerStats[p.id] || {};
            const last5 = (s.form || []).slice(-5);
            const best = getBestStreak(s.form || []);
            const fav = getFavPickFromMatches(matches, p.id);

            return (
              <div key={p.id} className="row">
                <div>{i + 1}</div>

                <div className="name-cell">
                  <div className="avatar" style={{ background: p.bg }}>
                    {p.emoji || p.short}
                  </div>
                  {p.name}
                </div>

                <div>{s.right}-{s.wrong}</div>
                <div>{s.total}</div>
                <div>{s.accuracy}%</div>
                <div>{fav}</div>

                <div className="form">
                  {last5.map((r: string, idx: number) => (
                    <div key={idx} className={`form-circle ${r === 'W' ? 'win' : 'loss'}`}>
                      {r}
                    </div>
                  ))}
                </div>

                <div>{best}</div>
                <div className="points">{s.points}</div>
              </div>
            );
          })}

        </div>
      </div> {/* ✅ FIXED CLOSE */}

      {/* FEED (OUTSIDE EXPORT) */}
      <div style={{ marginTop: '30px' }}>
        <div className="title" style={{ marginBottom: '10px' }}>
          <Calendar size={16} />
          <h3>Prediction Feed</h3>
        </div>

        <FilterBar onFilterChange={setFeedFilters} activeFilters={feedFilters} />

        {filteredFeed.map((m: any, idx: number) => (
          <MatchCard key={m.id} match={m} isLatest={idx === 0} />
        ))}
      </div>

    </div>
  );
};

export default LeaderboardPage;