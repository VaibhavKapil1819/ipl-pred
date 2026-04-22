import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { ref, update } from 'firebase/database';
import { CheckCircle2 } from 'lucide-react';

interface PredictionSlipProps {
  match: {
    id: string;
    team1: string;
    team2: string;
    preds?: { [key: string]: any };
  };
}

const PredictionSlip: React.FC<PredictionSlipProps> = ({ match }) => {
  const { userPlayerId } = useAuth();
  
  const myCurrentPred = match.preds?.[userPlayerId as string];
  const initialPick = typeof myCurrentPred === 'object' ? myCurrentPred.pick : (myCurrentPred || '');

  const [pick, setPick] = useState(initialPick);
  const [saving, setSaving] = useState(false);
  
  // Use a ref to track what the user actually wants to see.
  // This prevents the UI from "flickering" back to the old value
  // while the server is still processing the update.
  const userIntent = React.useRef(initialPick);

  useEffect(() => {
    // Only update the local state if:
    // 1. We aren't currently saving
    // 2. The server data has actually changed to something new (not just catching up to our local change)
    if (!saving && initialPick !== pick) {
      if (initialPick === userIntent.current) {
        setPick(initialPick);
      } else if (pick === '' && initialPick !== '') {
        // Handle case where we were empty but now have data
        setPick(initialPick);
        userIntent.current = initialPick;
      }
    }
  }, [initialPick, saving]);

  const handleSave = async (newPick: string) => {
    if (!userPlayerId) return;
    
    setPick(newPick);
    userIntent.current = newPick;
    setSaving(true);
    
    try {
      await update(ref(db, `matches/${match.id}/preds`), {
        [userPlayerId]: {
          pick: newPick
        }
      });
    } catch (err) {
      console.error("Failed to auto-save prediction", err);
      // Revert on error
      setPick(initialPick);
      userIntent.current = initialPick;
    } finally {
      setSaving(false);
    }
  };

  // Component now uses internal state and syncs to DB on change

  return (
    <div style={{ background: 'rgba(255,107,0,0.05)', borderRadius: '10px', padding: '10px', border: '1px solid rgba(255,107,0,0.2)', display: 'flex', alignItems: 'center', gap: '10px', flex: 1, marginLeft: '10px' }}>
      <select 
        value={pick}
        onChange={(e) => handleSave(e.target.value)}
        className="pending-select"
        style={{ height: '32px', flex: 1 }}
        disabled={saving}
      >
        <option value="">Your Win Pick</option>
        <option value={match.team1}>{match.team1}</option>
        <option value={match.team2}>{match.team2}</option>
      </select>
      
      {saving ? (
        <div style={{ fontSize: '10px', color: 'var(--txt2)' }}>Saving...</div>
      ) : pick ? (
        <div style={{ fontSize: '10px', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CheckCircle2 size={12} /> Logged
        </div>
      ) : null}
    </div>
  );
};

export default PredictionSlip;
