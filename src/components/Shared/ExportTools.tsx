import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Copy, Image as ImageIcon, Check } from 'lucide-react';
import { PLAYERS } from '../../lib/firebase';

interface ExportToolsProps {
  points: { [key: string]: number };
}

const ExportTools: React.FC<ExportToolsProps> = ({ points }) => {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const copyAsText = () => {
    const sorted = [...PLAYERS].sort((a, b) => points[b.id] - points[a.id]);
    let text = "🏆 *IPL Prediction League - Leaderboard* 🏆\n\n";
    
    sorted.forEach((p, i) => {
      const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🔹";
      text += `${medal} ${p.name}: *${points[p.id]} pts*\n`;
    });
    
    text += "\nSent from IPL Predictor 🏏";
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAsImage = async () => {
    const element = document.getElementById('leaderboard-section');
    if (!element) return;
    
    setExporting(true);
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#0f1117',
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `IPL_Full_Summary_${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    } catch (err) {
      console.error("Export failed", err);
      alert("Failed to generate image");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="export-bar" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
      <button className={`btn-exp ${copied ? 'ok' : ''}`} onClick={copyAsText} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? 'Copied Stats!' : 'Copy as Text'}
      </button>

      <button className="btn-exp" onClick={exportAsImage} disabled={exporting} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {exporting ? <div className="loading-spinner" style={{ width: '12px', height: '12px', borderWidth: '2px' }}></div> : <ImageIcon size={14} />}
        {exporting ? 'Generating...' : 'Download Image'}
      </button>
    </div>
  );
};

export default ExportTools;
