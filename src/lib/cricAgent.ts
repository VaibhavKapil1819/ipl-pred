import { PLAYERS } from './firebase';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export const getAgentResponse = async (userMessage: string, context: { playerStats: any, matches: any[] }, apiKey?: string) => {
  const finalKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
  
  const analysis = analyzeDeeply(context.matches);
  
  if (!finalKey) {
    return "I am currently operating in offline mode. Please configure a valid Gemini API key in the system settings to enable live analysis and web searching capabilities.";
  }

  const systemPrompt = `
You are the "Cric Agent", a premium, professional AI cricket analyst for the IPL 2026 Prediction League.
Your objective is to provide high-level insights, data analysis, and predictive advice to the league participants.

PROFESSIONAL TONE:
- Be extremely concise, analytical, and objective.
- Avoid unnecessary "fluff" or introductory fillers.
- Use bullet points for efficiency; avoid long paragraphs.
- Keep your total response length under 200 words unless explicitly asked for a deep dive.

LEAGUE DATA CONTEXT:
- Standings & Accuracy: ${JSON.stringify(context.playerStats)}
- Team Loyalty Analysis: ${JSON.stringify(analysis.loyalty)}
- Match Rivalries: ${JSON.stringify(analysis.rivalries)}
- Recent Match History: ${JSON.stringify(context.matches.slice(-15))}

RULES & POINTS:
- Correct pick = +2 points.
- Wrong pick = 0 points.
- Predictions lock at match start time.

YOUR CAPABILITIES:
1. Deep Data Analysis: Identify who is consistent, who is a "loyalist" to a team, and who are the top performers.
2. Predictive Modeling: Advise users on upcoming matches based on community consensus and expert form.
3. Real-time Knowledge: Use your internal knowledge and the provided context to answer any query regarding the website or IPL.

When responding to live score requests, explain that you are checking the latest data feeds.
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${finalKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemPrompt}\n\nUser Request: ${userMessage}` }]
        }]
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("Gemini API Error Response:", data);
      return `Agent Error: ${data.error?.message || 'Unknown connectivity issue'}`;
    }

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text;
    }
    throw new Error("Invalid API response format");
  } catch (err: any) {
    console.error("Cric Agent Error:", err);
    return `I apologize, but I encountered a connectivity issue: ${err.message || 'Analysis engine unreachable'}. Please ensure your API key is valid.`;
  }
};

const analyzeDeeply = (matches: any[]) => {
  const loyalty: any = {};
  const rivalries: any = {};

  matches.forEach(m => {
    PLAYERS.forEach(p1 => {
      const pred1 = m.preds?.[p1.id];
      const pick1 = (typeof pred1 === 'object' ? pred1?.pick : pred1)?.toUpperCase();
      
      if (pick1) {
        if (!loyalty[p1.id]) loyalty[p1.id] = {};
        loyalty[p1.id][pick1] = (loyalty[p1.id][pick1] || 0) + 1;
      }

      PLAYERS.forEach(p2 => {
        if (p1.id >= p2.id) return;
        const pred2 = m.preds?.[p2.id];
        const pick2 = (typeof pred2 === 'object' ? pred2?.pick : pred2)?.toUpperCase();
        
        if (pick1 && pick2 && pick1 !== pick2) {
          if (!rivalries[p1.id]) rivalries[p1.id] = {};
          rivalries[p1.id][p2.id] = (rivalries[p1.id][p2.id] || 0) + 1;
        }
      });
    });
  });

  return { loyalty, rivalries };
};
