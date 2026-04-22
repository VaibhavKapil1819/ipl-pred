import React from 'react';
import { TEAMS } from '../../lib/teams';

interface TeamLogoProps {
  team: string;
  size?: number;
}

const TeamLogo: React.FC<TeamLogoProps> = ({ team, size = 24 }) => {
  const teamData = TEAMS[team];
  
  if (!teamData) {
    return (
      <div 
        style={{ 
          width: size, 
          height: size, 
          borderRadius: '50%', 
          background: 'var(--bg3)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: size * 0.4,
          fontWeight: 600,
          color: 'var(--txt2)',
          border: '1px solid var(--bdr)'
        }}
      >
        {team.substring(0, 2)}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <img 
        src={teamData.logo} 
        alt={teamData.name}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))'
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
          (e.target as HTMLImageElement).parentElement!.classList.add('fallback');
        }}
      />
      <div className="team-fallback" style={{ display: 'none' }}>
         <div 
          style={{ 
            width: size, 
            height: size, 
            borderRadius: '50%', 
            background: teamData.color + '20', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: size * 0.4,
            fontWeight: 700,
            color: teamData.color,
            border: `1px solid ${teamData.color}40`
          }}
        >
          {team.substring(0, 2)}
        </div>
      </div>
    </div>
  );
};

export default TeamLogo;
