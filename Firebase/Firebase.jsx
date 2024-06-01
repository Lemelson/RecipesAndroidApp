// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeTYQ_A0njQkruPshXucQXCmNI-Q_JKT8",
  authDomain: "recipe-ee594.firebaseapp.com",
  projectId: "recipe-ee594",
  storageBucket: "recipe-ee594.appspot.com",
  messagingSenderId: "600814537591",
  appId: "1:600814537591:web:c67818f23446f72fbbef72",
  measurementId: "G-QD4HMRYHTF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

export {app, auth};
