import firebase from 'firebase'
const firebaseConfig = {
    apiKey: "AIzaSyBUJJDna_FQmkwiAhG4EQn_w-qRQnW7EWU",
    authDomain: "tictactoe-jolt.firebaseapp.com",
    databaseURL: "https://tictactoe-jolt.firebaseio.com",
    projectId: "tictactoe-jolt",
    storageBucket: "tictactoe-jolt.appspot.com",
    messagingSenderId: "1009894680943",
    appId: "1:1009894680943:web:98ff2a7cfaefbdbbfa609a",
    measurementId: "G-RS19VYQEW2"
};
var fire = firebase.initializeApp(firebaseConfig);
export default fire;