// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

var app;
var storage;

try {
  app = getApp();
} catch (error) {
  const firebaseConfig = {
    apiKey: "AIzaSyBzKuzjKriUidssayDTBTnOzhYhI6EgmbY",
    authDomain: "web-chat-app-2-f13ae.firebaseapp.com",
    projectId: "web-chat-app-2-f13ae",
    storageBucket: "web-chat-app-2-f13ae.appspot.com",
    messagingSenderId: "229937947974",
    appId: "1:229937947974:web:0ed237852f9333d6977147"
  };
  app = initializeApp(firebaseConfig);
}
storage = getStorage(app);

// Initialize Firebase

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, storage };
