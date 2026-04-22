import React, { useEffect, useState } from 'react';
import { messaging, db, auth } from '../../lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { ref, update } from 'firebase/database';
import { Bell, BellOff, Loader2 } from 'lucide-react';

const NotificationManager: React.FC = () => {
  const [, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>(Notification.permission);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (permission === 'granted') {
      requestToken();
    }

    // Handle foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received in foreground: ', payload);
      // You can show a toast here if you want
    });

    return () => unsubscribe();
  }, [permission]);

  const requestToken = async () => {
    setLoading(true);
    try {
      const currentToken = await getToken(messaging, {
        vapidKey: 'BLdhHqeBaQAqYrZjo-QJ_PXDKhWsh2P2LyDfmOF9YEtL-RnP3AfUQBQ6Gy0RvcpiMIhoBzOx_ajAndc1AtGccq0'
      });

      if (currentToken) {
        setToken(currentToken);
        saveTokenToDatabase(currentToken);
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    } catch (err) {
      console.error('An error occurred while retrieving token. ', err);
    } finally {
      setLoading(false);
    }
  };

  const saveTokenToDatabase = (fcmToken: string) => {
    const user = auth.currentUser;
    if (user) {
      update(ref(db, `users/${user.uid}`), {
        fcmToken,
        notificationsEnabled: true,
        lastTokenUpdate: new Date().toISOString()
      });
    }
  };

  const handleRequestPermission = async () => {
    setLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        await requestToken();
      }
    } catch (err) {
      console.error('Permission request failed', err);
    } finally {
      setLoading(false);
    }
  };

  if (permission === 'denied') return null;

  return (
    <div className="notification-trigger">
      <button 
        onClick={handleRequestPermission}
        disabled={loading || permission === 'granted'}
        className={`nav-btn ${permission === 'granted' ? 'active' : ''}`}
        title={permission === 'granted' ? 'Notifications Enabled' : 'Enable Notifications'}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : permission === 'granted' ? (
          <Bell size={18} color="var(--green)" />
        ) : (
          <BellOff size={18} />
        )}
      </button>
    </div>
  );
};

export default NotificationManager;
