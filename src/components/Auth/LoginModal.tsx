import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { ref, get } from 'firebase/database';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, X, ArrowLeft, CheckCircle } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const { resetPassword } = useAuth();
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const emailTrimmed = email.trim();

    try {
      if (view === 'signup') {
        if (password.length < 6) { throw new Error("Password must be 6+ chars"); }
        const emailKey = emailTrimmed.replace(/\./g, '_');
        const snap = await get(ref(db, `whitelist/${emailKey}`));
        if (!snap.exists()) {
          throw new Error("Email not whitelisted. Contact Vaibhav.");
        }
        await createUserWithEmailAndPassword(auth, emailTrimmed, password);
        onClose();
      } else if (view === 'login') {
        await signInWithEmailAndPassword(auth, emailTrimmed, password);
        onClose();
      } else if (view === 'forgot') {
        await resetPassword(emailTrimmed);
        setSuccess('Reset link sent to your email!');
        setTimeout(() => setView('login'), 3000);
      }
    } catch (err: any) {
      if (err.message.includes('email-already-in-use')) {
        setError("Email already registered");
      } else if (err.message.includes('invalid-credential') || err.message.includes('wrong-password') || err.message.includes('user-not-found')) {
        setError("Invalid email or password");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '400px' }}>
        <button className="btn-close" style={{ position: 'absolute', right: '16px', top: '16px' }} onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          {view === 'forgot' && (
            <button 
              onClick={() => setView('login')}
              style={{ background: 'none', border: 'none', color: 'var(--txt2)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginBottom: '16px', padding: 0 }}
            >
              <ArrowLeft size={14} /> Back to login
            </button>
          )}
          <h2 className="modal-title" style={{ fontSize: '28px', marginBottom: '8px' }}>
            {view === 'login' ? 'Welcome Back' : view === 'signup' ? 'Join League' : 'Reset Password'}
          </h2>
          <p style={{ color: 'var(--txt2)', fontSize: '13px' }}>
            {view === 'login' ? 'Enter your details to access the league' : 
             view === 'signup' ? 'Create an account to start predicting' : 
             'We\'ll send a reset link to your inbox'}
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle size={48} color="var(--green)" style={{ marginBottom: '16px' }} />
            <p style={{ fontWeight: 600 }}>{success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field" style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="yourname@gmail.com" 
                  required 
                  style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--bdr)', borderRadius: '12px', color: '#fff' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--txt2)' }} />
              </div>
            </div>

            {view !== 'forgot' && (
              <div className="field" style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    required 
                    style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--bdr)', borderRadius: '12px', color: '#fff' }}
                  />
                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--txt2)' }} />
                </div>
              </div>
            )}

            {view === 'login' && (
              <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                <button 
                  type="button"
                  onClick={() => setView('forgot')}
                  style={{ background: 'none', border: 'none', color: 'var(--orange)', fontSize: '12px', cursor: 'pointer', padding: 0 }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {error && (
              <div style={{ color: 'var(--red)', fontSize: '12px', marginBottom: '16px', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                {error}
              </div>
            )}

            <button className="btn-submit" type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'var(--grad-main)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px var(--orange-glow)' }}>
              {loading ? 'Please wait...' : view === 'login' ? 'Sign In' : view === 'signup' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--txt2)' }}>
          {view === 'signup' ? (
            <>Already have an account? <button onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: 'var(--orange)', fontWeight: 600, cursor: 'pointer', padding: 0 }}>Sign In</button></>
          ) : view === 'login' ? (
            <>New to the league? <button onClick={() => setView('signup')} style={{ background: 'none', border: 'none', color: 'var(--orange)', fontWeight: 600, cursor: 'pointer', padding: 0 }}>Join Now</button></>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
