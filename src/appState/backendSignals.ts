/**
 * The backend signals are used to communicate with the backend and reflect the current state of the backend.
 * To ease things a bit, I put all the firebase stuff in here as well.
 */
import { initializeApp } from "firebase/app"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB45yI75yXL7OkUQ8rgjiOOBE6OezCM6-w",
    authDomain: "integra-223bf.firebaseapp.com",
    projectId: "integra-223bf",
    storageBucket: "integra-223bf.appspot.com",
    messagingSenderId: "79318548135",
    appId: "1:79318548135:web:948810b4105db914a12582"
};

export const app = initializeApp(firebaseConfig)