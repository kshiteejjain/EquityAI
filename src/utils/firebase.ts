import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
    apiKey: "AIzaSyBR5UmOZZtuDgTzURv-G_FepGiuoObONhE",
    authDomain: "equityai-25262.firebaseapp.com",
    projectId: "equityai-25262",
    storageBucket: "equityai-25262.appspot.com",
    messagingSenderId: "308503569089",
    appId: "1:308503569089:web:2ff8fd7526419c668d2a40",
    measurementId: "G-1B7P7X56F5"
};
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);
const usersCollectionData = collection(firestore, "RegisteredUsers");
const auth = getAuth(firebaseApp);
const analytics = getAnalytics(firebaseApp);
export { firebaseApp, firestore, auth, usersCollectionData, onSnapshot, analytics };
