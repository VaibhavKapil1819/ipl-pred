import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Copy, Image as ImageIcon, Check } from 'lucide-react';

const ExportTools: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  // 🔥 COMMON FUNCTION
  const generateCanvas = async () => {
    const element = document.getElementById('leaderboard-section');
    if (!element) {
      alert('Leaderboard section not found');
      return null;
    }

    return await html2canvas(element, {
      backgroundColor: '#0f172a',
      scale: 2,
      useCORS: true
    });
  };

  // ✅ COPY IMAGE (FIXED)
  const copyAsImage = async () => {
    try {
      const canvas = await generateCanvas();
      if (!canvas) return;

      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(resolve)
      );

      if (!blob) {
        alert('Failed to create image');
        return;
      }

      // 🔥 Clipboard API check
      if (!navigator.clipboard || !(window as any).ClipboardItem) {
        alert('Clipboard image copy not supported in this browser');
        return;
      }

      await navigator.clipboard.write([
        new (window as any).ClipboardItem({
          'image/png': blob
        })
      ]);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

    } catch (err) {
      console.error(err);
      alert('Copy failed (Try Chrome)');
    }
  };

  // ✅ DOWNLOAD IMAGE (FIXED)
  const downloadImage = async () => {
    setExporting(true);

    try {
      const canvas = await generateCanvas();
      if (!canvas) return;

      const image = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = image;
      link.download = `IPL_Leaderboard_${new Date()
        .toISOString()
        .split('T')[0]}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error(err);
      alert('Download failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={styles.container}>

      {/* COPY IMAGE */}
      <button
        onClick={copyAsImage}
        style={{
          ...styles.btn,
          ...(copied ? styles.success : {})
        }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? 'Copied!' : 'Copy Image'}
      </button>

      {/* DOWNLOAD IMAGE */}
      <button
        onClick={downloadImage}
        disabled={exporting}
        style={{
          ...styles.btn,
          opacity: exporting ? 0.6 : 1,
          cursor: exporting ? 'not-allowed' : 'pointer'
        }}
      >
        {exporting ? <div style={styles.spinner}></div> : <ImageIcon size={14} />}
        {exporting ? 'Generating...' : 'Download Image'}
      </button>

    </div>
  );
};

export default ExportTools;



// 🎨 STYLES
const styles: any = {
  container: {
    display: 'flex',
    gap: '10px'
  },

  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: 500,
    background: '#1e293b',
    color: '#cbd5f5',
    border: '1px solid #334155',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },

  success: {
    background: '#22c55e',
    color: '#fff',
    border: '1px solid #22c55e'
  },

  spinner: {
    width: '12px',
    height: '12px',
    border: '2px solid #334155',
    borderTop: '2px solid #ff7a18',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};