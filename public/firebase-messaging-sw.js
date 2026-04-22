importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDSrPok0eBRCMeTM2s1wKvWWPqt4SQvLr4",
  authDomain: "ipl-predictions-a5f10.firebaseapp.com",
  databaseURL: "https://ipl-predictions-a5f10-default-rtdb.firebaseio.com",
  projectId: "ipl-predictions-a5f10",
  storageBucket: "ipl-predictions-a5f10.firebasestorage.app",
  messagingSenderId: "824242512776",
  appId: "1:824242512776:web:f27d80519805b0cb1c503d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/pwa-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
