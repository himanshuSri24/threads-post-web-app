// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA4tHkjGdsMxs-oPI0i4LV6FsToeQyvjVI",
    authDomain: "threads-f8c9a.firebaseapp.com",
    projectId: "threads-f8c9a",
    storageBucket: "threads-f8c9a.appspot.com",
    messagingSenderId: "1079369430283",
    appId: "1:1079369430283:web:e346ee3db9c99bdd97de0e",
    measurementId: "G-P5BLFC2P3G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
export const storage = getStorage(app);
