import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBvx0dVdXAp8fRQ1ZKGpWvxWSSxEmgUtK4",
    authDomain: "instagram-clone-560c8.firebaseapp.com",
    databaseURL: "https://instagram-clone-560c8-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-560c8",
    storageBucket: "instagram-clone-560c8.appspot.com",
    messagingSenderId: "949702836707",
    appId: "1:949702836707:web:b3c3a4be9c0618489a60d6",
    measurementId: "G-RECLTGYHCC"
});
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db , auth, storage};