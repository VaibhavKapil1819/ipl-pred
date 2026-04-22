import React from 'react';
import { PLAYERS } from '../../lib/firebase';
import { TEAMS } from '../../lib/teams';
import { User, Shield } from 'lucide-react';

interface FilterBarProps {
  onFilterChange: (filters: { team: string; player: string; status: string }) => void;
  activeFilters: { team: string; player: string; status: string };
  hideStatus?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, activeFilters, hideStatus }) => {
  const handleChange = (key: string, value: string) => {
    onFilterChange({ ...activeFilters, [key]: value });
  };

  return (
    <div className="filter-bar" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
      <div className="filter-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg2)', padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--bdr)' }}>
        <Shield size={12} color="var(--txt2)" />
        <select 
          value={activeFilters.team} 
          onChange={(e) => handleChange('team', e.target.value)}
          style={{ background: 'transparent', border: 'none', color: 'var(--txt)', fontSize: '12px', outline: 'none', cursor: 'pointer', padding: '4px 0' }}
        >
          <option value="">All Teams</option>
          {Object.values(TEAMS).map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div className="filter-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg2)', padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--bdr)' }}>
        <User size={12} color="var(--txt2)" />
        <select 
          value={activeFilters.player} 
          onChange={(e) => handleChange('player', e.target.value)}
          style={{ background: 'transparent', border: 'none', color: 'var(--txt)', fontSize: '12px', outline: 'none', cursor: 'pointer', padding: '4px 0' }}
        >
          <option value="">All Players</option>
          {PLAYERS.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {!hideStatus && (
        <div className="status-tabs" style={{ display: 'flex', background: 'var(--bg2)', padding: '3px', borderRadius: '20px', border: '1px solid var(--bdr)' }}>
          <button 
            onClick={() => handleChange('status', 'upcoming')}
            style={{ 
              padding: '4px 12px', 
              borderRadius: '20px', 
              border: 'none', 
              fontSize: '11px', 
              fontWeight: 600,
              cursor: 'pointer',
              background: activeFilters.status === 'upcoming' ? 'var(--orange)' : 'transparent',
              color: activeFilters.status === 'upcoming' ? '#fff' : 'var(--txt2)'
            }}
          >
            Upcoming
          </button>
          <button 
            onClick={() => handleChange('status', 'completed')}
            style={{ 
              padding: '4px 12px', 
              borderRadius: '20px', 
              border: 'none', 
              fontSize: '11px', 
              fontWeight: 600,
              cursor: 'pointer',
              background: activeFilters.status === 'completed' ? 'var(--orange)' : 'transparent',
              color: activeFilters.status === 'completed' ? '#fff' : 'var(--txt2)'
            }}
          >
            Completed
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
