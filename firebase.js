import firebase from 'firebase/app';
import 'firebase/storage';


// const firebaseConfig = {
//     apiKey: "AIzaSyAkAUO2UkCj7NiSrmTLDDDzl2KpHShm6BQ",
//     authDomain: "fruitiionfinal-dev.firebaseapp.com",
//     projectId: "fruitiionfinal-dev",
//     storageBucket: "fruitiionfinal-dev.appspot.com",
//     messagingSenderId: "876797678213",
//     appId: "1:876797678213:web:c6e463e91065a5e28c4fec",
//     measurementId: "G-WMSBLPP1Z4"
// };

const firebaseConfig = {
    apiKey: "AIzaSyB_zOXP-bAhP-OKOezxU7Xh38DD9j9N3uY",
    authDomain: "fruitiionfinal-prod.firebaseapp.com",
    projectId: "fruitiionfinal-prod",
    storageBucket: "fruitiionfinal-prod.appspot.com",
    messagingSenderId: "436693750708",
    appId: "1:436693750708:web:5c6d4be69b3737da4718e1",
    measurementId: "G-TYTR2X7K1H"
  };


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
 } else {
    firebase.app(); // if already initialized, use that one
 }
 
 export const sponsorStorageRef = firebase.storage().ref('elitehomeloans/sponsor/');
 export const investorStorageRef = firebase.storage().ref('elitehomeloans/investor/');
 export const dealStorageRef = firebase.storage().ref('elitehomeloans/deal/');
 export const investmentStorageRef = firebase.storage().ref('elitehomeloans/investment/');