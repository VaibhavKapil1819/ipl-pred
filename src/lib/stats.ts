import { PLAYERS } from './firebase';

export const calculateStats = (matches: any[]) => {
  const stats: { [key: string]: any } = {};
<<<<<<< Updated upstream
  
=======

  // init
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      form: [] // Last 5-8 results
    };
  });

  // Sort matches by timestamp ASC for streak calculation
  const sortedMatches = [...matches].sort((a, b) => (a.ts || 0) - (b.ts || 0));
=======

      form: [] // ✅ FULL history (DO NOT LIMIT)
    };
  });

  // 🔥 MUST be sorted (old → new)
  const sortedMatches = [...matches].sort(
    (a, b) => (a.ts || 0) - (b.ts || 0)
  );
>>>>>>> Stashed changes

  sortedMatches.forEach(m => {
    // ❌ skip incomplete matches
    if (!m.winner) return;
    
    PLAYERS.forEach(p => {
      const s = stats[p.id];
      const pred = m.preds?.[p.id];
      const pick = typeof pred === 'object' ? pred.pick : pred;

<<<<<<< Updated upstream
      if (!pick || pick === "") {
        s.form.push('skip');
      } else if (pick === m.winner) {
=======
      const userPick = pick?.toString().toLowerCase();
      const actualWinner = m.winner?.toString().toLowerCase();

      // ❌ skip if no prediction
      if (!userPick) return;

      s.total += 1;

      if (userPick === actualWinner) {
        // ✅ WIN
>>>>>>> Stashed changes
        s.points += 2;
        s.right += 1;
        s.total += 1;
        s.currentStreak += 1;
        s.currentLosingStreak = 0;
<<<<<<< Updated upstream
        if (s.currentStreak > s.bestStreak) s.bestStreak = s.currentStreak;
        s.form.push('right');
=======

        if (s.currentStreak > s.bestStreak) {
          s.bestStreak = s.currentStreak;
        }

        s.form.push('W'); // ✅ FULL history
>>>>>>> Stashed changes
      } else {
        // ❌ LOSS
        s.wrong += 1;
        s.total += 1;
        s.currentStreak = 0;
        s.currentLosingStreak += 1;
<<<<<<< Updated upstream
        if (s.currentLosingStreak > s.bestLosingStreak) s.bestLosingStreak = s.currentLosingStreak;
        s.form.push('wrong');
      }

      if (s.form.length > 8) s.form.shift();
=======

        if (s.currentLosingStreak > s.bestLosingStreak) {
          s.bestLosingStreak = s.currentLosingStreak;
        }

        s.form.push('L'); // ✅ FULL history
      }
>>>>>>> Stashed changes
    });
  });

  // accuracy
  Object.keys(stats).forEach(id => {
    const s = stats[id];
<<<<<<< Updated upstream
    s.accuracy = s.total > 0 ? Math.round((s.right / s.total) * 100) : 0;
=======
    s.accuracy =
      s.total > 0
        ? Math.round((s.right / s.total) * 100)
        : 0;
>>>>>>> Stashed changes
  });

  return stats;
};
