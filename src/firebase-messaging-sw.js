// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyAbBSpKktRmwA1h6WB8t-YnrNy-FuEUYgQ",
    authDomain: "kebab-11957.firebaseapp.com",
    databaseURL: "https://kebab-11957.firebaseio.com",
    projectId: "kebab-11957",
    storageBucket: "kebab-11957.appspot.com",
    messagingSenderId: "454065515937",
    appId: "1:454065515937:web:12212027bb56425baf6fe0",
  measurementId: 'G-measurement-id',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();