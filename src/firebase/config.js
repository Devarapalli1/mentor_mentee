// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNiRP97odB-WjYio4bxPEnWonjwKLku60",
  authDomain: "mentor-mentee-99fee.firebaseapp.com",
  databaseURL: "https://mentor-mentee-99fee-default-rtdb.firebaseio.com",
  projectId: "mentor-mentee-99fee",
  storageBucket: "mentor-mentee-99fee.appspot.com",
  messagingSenderId: "397925331966",
  appId: "1:397925331966:web:a502ccbb72c04b33af06af",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { app, db, auth };
