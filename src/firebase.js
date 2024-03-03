// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqw-PeO1HgUjdf9uzsePE-4MYRJCo93xc",
    authDomain: "realtor-practice.firebaseapp.com",
    projectId: "realtor-practice",
    storageBucket: "realtor-practice.appspot.com",
    messagingSenderId: "780199152242",
    appId: "1:780199152242:web:012ed5e66765cee27d90eb"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore()