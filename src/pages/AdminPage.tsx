import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, PLAYERS } from '../lib/firebase';
import { ref, push, onValue, remove, set } from 'firebase/database';
import { Shield, UserPlus, FilePlus, Trash2 } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [whitelist, setWhitelist] = useState<{ [key: string]: string }>({});
  
  // Form States
  const [newMatch, setNewMatch] = useState({
    team1: '', team2: '', date: new Date().toISOString().split('T')[0],
    cutoffTime: '', num: ''
  });
  const [newUser, setNewUser] = useState({ email: '', playerId: '' });

  useEffect(() => {
    if (!isAdmin) return;

    const unsubMatches = onValue(ref(db, 'matches'), (snap) => {
      const data = snap.val() || {};
      setMatches(Object.entries(data).map(([id, m]: [string, any]) => ({ ...m, id }))
        .sort((a, b) => (b.ts || 0) - (a.ts || 0)));
    });

    const unsubWhitelist = onValue(ref(db, 'whitelist'), (snap) => {
      setWhitelist(snap.val() || {});
    });

    return () => { unsubMatches(); unsubWhitelist(); };
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="no-matches" style={{ padding: '4rem' }}>
        <Shield size={48} style={{ marginBottom: '16px', color: 'var(--red)' }} />
        <h3>Access Restricted</h3>
        <p>This page is only for the league administrator.</p>
      </div>
    );
  }

  const handleAddMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatch.team1 || !newMatch.team2) return;

    await push(ref(db, 'matches'), {
      ...newMatch,
      ts: Date.now(),
      preds: {}
    });

    setNewMatch({ team1: '', team2: '', date: new Date().toISOString().split('T')[0], cutoffTime: '', num: '' });
  };

  const handleAddWhitelist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.playerId) return;
    const emailKey = newUser.email.trim().replace(/\./g, '_');
    await set(ref(db, `whitelist/${emailKey}`), newUser.playerId);
    setNewUser({ email: '', playerId: '' });
  };

  const deleteMatch = async (id: string) => {
    if (confirm('Delete this match and all predictions?')) {
      await remove(ref(db, `matches/${id}`));
    }
  };

  const removeFromWhitelist = async (key: string) => {
    if (confirm('Remove this user from whitelist?')) {
      await remove(ref(db, `whitelist/${key}`));
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '20px' }}>
      <div>
        <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FilePlus size={14} /> Create New Match
        </div>
        <form className="form-card" onSubmit={handleAddMatch}>
          <div className="form-row">
            <div className="field">
              <label>Team 1</label>
              <input type="text" value={newMatch.team1} onChange={e => setNewMatch({...newMatch, team1: e.target.value})} placeholder="e.g. CSK" required />
            </div>
            <div className="field">
              <label>Team 2</label>
              <input type="text" value={newMatch.team2} onChange={e => setNewMatch({...newMatch, team2: e.target.value})} placeholder="e.g. MI" required />
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label>Match Date</label>
              <input type="date" value={newMatch.date} onChange={e => setNewMatch({...newMatch, date: e.target.value})} />
            </div>
            <div className="field">
              <label>Prediction Cutoff (Deadline)</label>
              <input type="datetime-local" value={newMatch.cutoffTime} onChange={e => setNewMatch({...newMatch, cutoffTime: e.target.value})} required />
            </div>
          </div>
          <div className="field" style={{ marginBottom: '16px' }}>
            <label>Match Number / Label</label>
            <input type="text" value={newMatch.num} onChange={e => setNewMatch({...newMatch, num: e.target.value})} placeholder="e.g. Opening Match" />
          </div>
          <button className="btn-submit" type="submit">Create Match & Open Bidding</button>
        </form>

        <div className="section-title">Match Management</div>
        <div className="matches-list">
          {matches.map(m => (
            <div key={m.id} className="match-card" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{m.team1} vs {m.team2}</div>
                <div style={{ fontSize: '11px', color: 'var(--txt2)' }}>{m.date} · {m.id}</div>
              </div>
              <div className="match-actions">
                <button className="btn-act del" onClick={() => deleteMatch(m.id)}><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={14} /> Add Players
        </div>
        <form className="form-card" onSubmit={handleAddWhitelist}>
          <div className="field" style={{ marginBottom: '10px' }}>
            <label>Email Address</label>
            <input type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="friend@gmail.com" required />
          </div>
          <div className="field" style={{ marginBottom: '14px' }}>
            <label>Assign to Player</label>
            <select value={newUser.playerId} onChange={e => setNewUser({...newUser, playerId: e.target.value})} required>
              <option value="">— Select —</option>
              {PLAYERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <button className="btn-submit" type="submit" style={{ padding: '8px' }}>Whitelist Email</button>
        </form>

        <div className="section-title">Whitelisted Players</div>
        <div className="form-card" style={{ padding: '10px' }}>
          {Object.entries(whitelist).map(([encodedEmail, pId]) => (
            <div key={encodedEmail} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', padding: '6px 0', borderBottom: '1px solid var(--bdr)' }}>
              <div>
                <div style={{ color: 'var(--txt2)' }}>{encodedEmail.replace(/_/g, '.')}</div>
                <div style={{ fontWeight: 600, color: 'var(--orange)' }}>{pId}</div>
              </div>
              <button className="btn-act del" onClick={() => removeFromWhitelist(encodedEmail)} style={{ padding: '4px' }}><Trash2 size={10} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
