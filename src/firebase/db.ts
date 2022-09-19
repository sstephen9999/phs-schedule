import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC93VuiIeFdYPrACj0NOzpTakpAxRVhGMQ",
  authDomain: "phs-schedule-e341b.firebaseapp.com",
  projectId: "phs-schedule-e341b",
  storageBucket: "phs-schedule-e341b.appspot.com",
  messagingSenderId: "456048612408",
  appId: "1:456048612408:web:394999657d4f97c39282cd",
};
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();
export default db;
