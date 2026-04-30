import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { calculateStats } from '../lib/stats';

interface MatchContextType {
  matches: any[];
  playerStats: { [key: string]: any };
  loading: boolean;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<any[]>([]);
  const [playerStats, setPlayerStats] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onValue(ref(db, 'matches'), (snap) => {
      const data = snap.val() || {};
      
      // ✅ Keep ASC for stats calculation
      const list = Object.entries(data)
        .map(([id, m]: any) => ({ ...m, id }))
        .sort((a, b) => (a.ts || 0) - (b.ts || 0));

      setMatches(list);
      setPlayerStats(calculateStats(list));
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <MatchContext.Provider value={{ matches, playerStats, loading }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatches = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatches must be used within a MatchProvider');
  }
  return context;
};
