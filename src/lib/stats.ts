import { PLAYERS } from './firebase';

export const calculateStats = (matches: any[]) => {
  const stats: { [key: string]: any } = {};
  
  PLAYERS.forEach(p => {
    stats[p.id] = {
      points: 0,
      right: 0,
      wrong: 0,
      total: 0,
      accuracy: 0,
      currentStreak: 0,
      bestStreak: 0,
      currentLosingStreak: 0,
      bestLosingStreak: 0,
      form: [] // Last 5-8 results
    };
  });

  // Sort matches by timestamp ASC for streak calculation
  const sortedMatches = [...matches].sort((a, b) => (a.ts || 0) - (b.ts || 0));

  sortedMatches.forEach(m => {
    if (!m.winner) return;
    
    PLAYERS.forEach(p => {
      const s = stats[p.id];
      const pred = m.preds?.[p.id];
      const pick = typeof pred === 'object' ? pred.pick : pred;

      if (!pick || pick === "") {
        s.form.push('skip');
      } else if (pick === m.winner) {
        s.points += 2;
        s.right += 1;
        s.total += 1;
        s.currentStreak += 1;
        s.currentLosingStreak = 0;
        if (s.currentStreak > s.bestStreak) s.bestStreak = s.currentStreak;
        s.form.push('right');
      } else {
        s.wrong += 1;
        s.total += 1;
        s.currentStreak = 0;
        s.currentLosingStreak += 1;
        if (s.currentLosingStreak > s.bestLosingStreak) s.bestLosingStreak = s.currentLosingStreak;
        s.form.push('wrong');
      }

      if (s.form.length > 8) s.form.shift();
    });
  });

  Object.keys(stats).forEach(id => {
    const s = stats[id];
    s.accuracy = s.total > 0 ? Math.round((s.right / s.total) * 100) : 0;
  });

  return stats;
};
