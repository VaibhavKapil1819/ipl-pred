import React, { useState } from 'react';
import { db, PLAYERS } from '../../lib/firebase';
import { ref, update } from 'firebase/database';
import { X, Save } from 'lucide-react';

interface AdminEditModalProps {
  match: any;
  onClose: () => void;
}

const AdminEditModal: React.FC<AdminEditModalProps> = ({ match, onClose }) => {
  const [formData, setFormData] = useState({
    team1: match.team1 || '',
    team2: match.team2 || '',
    date: match.date || '',
    cutoffTime: match.cutoffTime || '',
    winner: match.winner || '',
    num: match.num || ''
  });

  const [preds, setPreds] = useState(match.preds || {});
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePredChange = (playerId: string, field: string, value: any) => {
    setPreds((prev: any) => {
      const current = prev[playerId] || {};
      const updated = typeof current === 'object' ? { ...current, [field]: value } : { pick: value };
      return { ...prev, [playerId]: updated };
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await update(ref(db, `matches/${match.id}`), {
        ...formData,
        preds
      });
      onClose();
    } catch (err) {
      console.error("Failed to update match", err);
      alert("Error saving details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '600px' }}>
        <div className="modal-head">
          <div className="modal-title">Admin Power-Edit</div>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-section">Match Details</div>
        <div className="form-row">
          <div className="field">
            <label>Team 1</label>
            <input type="text" value={formData.team1} onChange={e => handleFieldChange('team1', e.target.value)} />
          </div>
          <div className="field">
            <label>Team 2</label>
            <input type="text" value={formData.team2} onChange={e => handleFieldChange('team2', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label>Date</label>
            <input type="date" value={formData.date} onChange={e => handleFieldChange('date', e.target.value)} />
          </div>
          <div className="field">
            <label>Prediction Deadline</label>
            <input type="datetime-local" value={formData.cutoffTime} onChange={e => handleFieldChange('cutoffTime', e.target.value)} />
          </div>
        </div>

        <div className="modal-section" style={{ color: 'var(--yellow)' }}>Official Results</div>
        <div className="form-row">
          <div className="field">
            <label>Match Winner</label>
            <select value={formData.winner} onChange={e => handleFieldChange('winner', e.target.value)}>
              <option value="">— Not Decided —</option>
              <option value={formData.team1}>{formData.team1}</option>
              <option value={formData.team2}>{formData.team2}</option>
            </select>
          </div>
        </div>

        <div className="modal-section">Player Predictions (Admin Override)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {PLAYERS.map(p => {
            const pPred = preds[p.id] || {};
            const pick = typeof pPred === 'object' ? pPred.pick : pPred;

            return (
              <div key={p.id} style={{ padding: '10px', background: 'var(--bg3)', borderRadius: '8px', border: '1px solid var(--bdr)' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: p.color, marginBottom: '6px' }}>{p.name}</div>
                <div className="field">
                  <select value={pick} onChange={e => handlePredChange(p.id, 'pick', e.target.value)} style={{ fontSize: '12px', padding: '5px' }}>
                    <option value="">No Pick</option>
                    <option value={formData.team1}>{formData.team1}</option>
                    <option value={formData.team2}>{formData.team2}</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        <button className="btn-save" onClick={handleSave} disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Save size={16} />
          {loading ? 'Saving Changes...' : 'Save All Overrides'}
        </button>
      </div>
    </div>
  );
};

export default AdminEditModal;
