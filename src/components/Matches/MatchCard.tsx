import React from 'react';
import { PLAYERS } from '../../lib/firebase';

// ✅ Updated logos (your links)
const TEAM_LOGOS: any = {
  CSK: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/500px-Chennai_Super_Kings_Logo.svg.png',
  MI: 'https://upload.wikimedia.org/wikipedia/en/c/cd/Mumbai_Indians_Logo.svg',
  RCB: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Royal_Challengers_Bengaluru_Logo.svg/330px-Royal_Challengers_Bengaluru_Logo.svg.png',
  SRH: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/51/Sunrisers_Hyderabad_Logo.svg/500px-Sunrisers_Hyderabad_Logo.svg.png',
  RR: 'https://static.vecteezy.com/system/resources/previews/075/244/952/non_2x/rajasthan-royals-logo-rr-logo-icon-on-transparent-background-free-png.png',
  KKR: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Kolkata_Knight_Riders_Logo.svg/500px-Kolkata_Knight_Riders_Logo.svg.png',
  DC: 'https://upload.wikimedia.org/wikipedia/en/2/2f/Delhi_Capitals.svg',
  PBKS: 'https://upload.wikimedia.org/wikipedia/en/d/d4/Punjab_Kings_Logo.svg',
  LSG: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/34/Lucknow_Super_Giants_Logo.svg/500px-Lucknow_Super_Giants_Logo.svg.png',
  GT: 'https://upload.wikimedia.org/wikipedia/en/0/09/Gujarat_Titans_Logo.svg',
};

const MatchCard = ({ match, isLatest }: any) => {

  const getPick = (pred: any) => {
    if (!pred) return null;
    return typeof pred === 'object' ? pred.pick : pred;
  };

  const getResult = (pick: string | null) => {
    if (!pick || !match.winner) return null;
    return pick.toLowerCase() === match.winner.toLowerCase()
      ? 'win'
      : 'loss';
  };

  return (
    <div
      style={{
        background: '#0f172a',
        borderRadius: '18px',
        padding: '18px',
        marginBottom: '18px',
        border: isLatest
          ? '1.5px solid #22c55e'
          : '1px solid rgba(255,255,255,0.05)',
      }}
    >

      {/* 🔝 HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={TEAM_LOGOS[match.team1]} style={{ width: 34 }} />
          <b>{match.team1}</b>
        </div>

        <div style={{ opacity: 0.6, fontSize: '13px' }}>VS</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <b>{match.team2}</b>
          <img src={TEAM_LOGOS[match.team2]} style={{ width: 34 }} />
        </div>
      </div>

      {/* DATE */}
      <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '14px' }}>
        {match.date}
      </div>

      {/* 👥 PLAYER CARDS */}
      <div style={{ display: 'flex', gap: '14px' }}>
        {PLAYERS.map((p: any) => {
          const rawPred = match.preds?.[p.id];
          const pick = getPick(rawPred);
          const teamKey = pick ? pick.toUpperCase().trim() : null;
          const result = getResult(pick);

          return (
            <div
              key={p.id}
              style={{
                flex: 1,
                borderRadius: '14px',
                padding: '14px',
                minHeight: '120px',
                textAlign: 'center',
                border:
                  result === 'win'
                    ? '1.5px solid #22c55e'
                    : result === 'loss'
                    ? '1.5px solid #ef4444'
                    : '1px solid rgba(255,255,255,0.1)',
                background:
                  result === 'win'
                    ? 'rgba(34,197,94,0.12)'
                    : 'rgba(255,255,255,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '6px'
              }}
            >

              {/* PLAYER */}
              <div style={{ fontSize: '11px', color: p.color }}>
                {p.short}
              </div>

              {/* LOGO */}
              {teamKey && TEAM_LOGOS[teamKey] ? (
                <img
                  src={TEAM_LOGOS[teamKey]}
                  style={{
                    width: 44,
                    height: 44,
                    margin: 'auto',
                    objectFit: 'contain'
                  }}
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              ) : (
                <div style={{ opacity: 0.4 }}>—</div>
              )}

              {/* TEAM */}
              <div style={{ fontSize: '12px' }}>
                {teamKey || '-'}
              </div>

              {/* POINTS */}
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color:
                    result === 'win'
                      ? '#22c55e'
                      : result === 'loss'
                      ? '#ef4444'
                      : '#94a3b8'
                }}
              >
                {result === 'win'
                  ? '+2 pts'
                  : result === 'loss'
                  ? '0 pts'
                  : ''}
              </div>

            </div>
          );
        })}
      </div>

      {/* 🏆 WINNER */}
      {match.winner && (
        <div
          style={{
            marginTop: '16px',
            padding: '10px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🏆 <b>Winner:</b> {match.winner}
        </div>
      )}

      {/* 🔒 STATUS */}
      <div style={{ marginTop: '12px', textAlign: 'right' }}>
        <span
          style={{
            fontSize: '11px',
            padding: '6px 10px',
            borderRadius: '8px',
            background: 'rgba(239,68,68,0.1)',
            color: '#ef4444'
          }}
        >
          LOCKS CLOSED
        </span>
      </div>

    </div>
  );
};

export default MatchCard;