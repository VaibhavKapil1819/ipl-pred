import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db, PLAYERS } from '../../lib/firebase';
import { ref, update } from 'firebase/database';
import { Timer, Settings } from 'lucide-react';
import PredictionSlip from './PredictionSlip';
import AdminEditModal from './AdminEditModal';
import TeamLogo from '../Shared/TeamLogo';

interface MatchCardProps {
  match: {
    id: string;
    team1: string;
    team2: string;
    date: string;
    cutoffTime?: string;
    winner?: string;
    preds?: { [key: string]: any };
    mvp?: string;
  };
  playerStats?: { [key: string]: any };
}

const MatchCard: React.FC<MatchCardProps> = ({ match, playerStats }) => {
  const { isAdmin, userPlayerId } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  
  const isLocked = match.cutoffTime ? new Date() > new Date(match.cutoffTime) : false;
  const isDecided = !!match.winner;

  const handleSetWinner = async (val: string) => {
    if (!isAdmin) return;
    await update(ref(db, `matches/${match.id}`), { winner: val });
  };

  return (
    <div className="match-card">
      <div className="match-header">
        <div style={{ flex: 1 }}>
          <div className="match-teams" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TeamLogo team={match.team1} size={28} />
              <span>{match.team1}</span>
            </div>
            <span style={{ fontSize: '14px', color: 'var(--txt2)' }}>vs</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TeamLogo team={match.team2} size={28} />
              <span>{match.team2}</span>
            </div>
          </div>
          <div className="match-meta">
            {match.date}
          </div>
        </div>
        
        <div className="match-actions" style={{ gap: '8px', alignSelf: 'flex-start' }}>
          {isAdmin && (
            <button 
              className="btn-act edit" 
              onClick={() => setShowEditModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--yellow)', background: 'rgba(250, 204, 21, 0.1)', padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(250, 204, 21, 0.2)', fontSize: '11px', fontWeight: 600 }}
            >
              <Settings size={12} />
              Edit Match
            </button>
          )}
        </div>
      </div>

      <div className="preds-row">
        {PLAYERS.map(p => {
          const rawPred = match.preds?.[p.id];
          const s = playerStats?.[p.id] || {};
          
          let pick = '—';
          if (rawPred) {
            pick = typeof rawPred === 'object' ? rawPred.pick || '—' : rawPred;
          }

          const correct = isDecided && pick === match.winner;
          const wrong = isDecided && pick !== '—' && pick !== match.winner;
          const pts = correct ? 2 : 0;

          return (
            <div key={p.id} className={`pred-badge ${correct ? 'correct' : wrong ? 'wrong' : ''}`}>
              <div className="pb-name" style={{ color: p.color, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{p.name.split(' ')[0]}</span>
                <div className="form-pips" style={{ gap: '2px', display: 'flex' }}>
                  {s.form?.slice(-3).map((result: string, idx: number) => (
                    <div key={idx} className={`pip ${result}`} style={{ width: '4px', height: '4px' }} />
                  ))}
                </div>
              </div>
              <div className="pb-content">
                <div className="pb-team">
                  {pick}
                </div>
                <div className="pb-pts">
                  {correct ? `+${pts} pts` : wrong ? '0 pts' : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--bdr)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {isDecided ? (
            <div className="winner-badge">
              <span>🏆</span>
              <span className="winner-label">Winner:</span>
              <span>{match.winner}</span>
            </div>
          ) : (
            isAdmin ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--txt2)' }}>Set winner:</span>
                <select 
                  className="pending-select" 
                  onChange={(e) => handleSetWinner(e.target.value)}
                  defaultValue=""
                >
                  <option value="">— Pending —</option>
                  <option value={match.team1}>{match.team1}</option>
                  <option value={match.team2}>{match.team2}</option>
                </select>
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--txt2)' }}>⏳ Match result pending</div>
            )
          )}
          
          {userPlayerId && !isLocked && !isDecided && (
            <PredictionSlip key={match.id} match={match} />
          )}
        </div>

        <div style={{ textAlign: 'right' }}>
          {match.cutoffTime && (
            <div className="deadline-badge" style={{ padding: '6px 12px', borderRadius: '10px', background: isLocked ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 107, 0, 0.1)', color: isLocked ? 'var(--red)' : 'var(--orange)', border: `1px solid ${isLocked ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 107, 0, 0.2)'}` }}>
              <Timer size={12} style={{ marginRight: '6px' }} />
              <span style={{ fontSize: '11px', fontWeight: 700 }}>
                {isLocked ? 'LOCKS CLOSED' : `LOCKS: ${new Date(match.cutoffTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
              </span>
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <AdminEditModal match={match} onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
};

export default MatchCard;
