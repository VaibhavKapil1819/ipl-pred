import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Copy, Image as ImageIcon, Check } from 'lucide-react';

const ExportTools = () => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const capture = async () => {
    const el = document.getElementById('leaderboard-section');
    if (!el) {
      alert('Leaderboard section not found');
      return null;
    }

    return await html2canvas(el, {
      backgroundColor: '#0f172a',
      scale: 2,
      useCORS: true
    });
  };

  const download = async () => {
    setLoading(true);
    try {
      const canvas = await capture();
      if (!canvas) return;

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'leaderboard.png';
      link.click();

    } catch (e) {
      console.error(e);
      alert('Export failed');
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    try {
      const canvas = await capture();
      if (!canvas) return;

      const blob = await (await fetch(canvas.toDataURL())).blob();

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

    } catch {
      alert('Copy not supported → use download');
    }
  };

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <button onClick={copy} style={btn}>
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? 'Copied!' : 'Copy'}
      </button>

      <button onClick={download} style={btn}>
        {loading ? '...' : <ImageIcon size={14} />}
        {loading ? 'Generating' : 'Download'}
      </button>
    </div>
  );
};

export default ExportTools;

const btn = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 12px',
  background: '#1e293b',
  color: '#cbd5f5',
  border: '1px solid #334155',
  borderRadius: 8,
  cursor: 'pointer'
};