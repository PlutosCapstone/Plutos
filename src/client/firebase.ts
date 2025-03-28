import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
/*
	Related issue:
	https://github.com/firebase/firebase-js-sdk/issues/7584#issuecomment-1785705367
lol seems like firebase didn't wanna get shot up by the ops
*/
// @ts-ignore
import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCB_v8qNqSj0sVl6PS-cDgUqsgTCc_di9I",
  authDomain: "plutos-291c6.firebaseapp.com",
  projectId: "plutos-291c6",
  storageBucket: "plutos-291c6.firebasestorage.app",
  messagingSenderId: "319037129665",
  appId: "1:319037129665:web:f9804deca2af22fac16540",
  measurementId: "G-JFVNPSYF5B",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

const analytics = getAnalytics(app);
export default app;
