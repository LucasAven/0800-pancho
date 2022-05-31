import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const {
  initializeAppCheck,
  ReCaptchaV3Provider,
} = require("firebase/app-check");

const firebaseApp = initializeApp({
  apiKey: "AIzaSyB9vqBD1eRIuYYySrVnK6U14GROSnlIiJQ",
  authDomain: "pancho-b512b.firebaseapp.com",
  projectId: "pancho-b512b",
  storageBucket: "pancho-b512b.appspot.com",
  messagingSenderId: "576234746922",
  appId: "1:576234746922:web:ae1fa74d75eb3768baff53",
  measurementId: "G-TSSXXNJ9QK",
});

// initializeAppCheck(firebaseApp, {
//   provider: new ReCaptchaV3Provider("6LeA5bUeAAAAAJOOIQjg3kT4R0drQBwzdosqsIo6"),
//   isTokenAutoRefreshEnabled: true,
// });

const auth = getAuth(firebaseApp);

export { firebaseApp, auth };
