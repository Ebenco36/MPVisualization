import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB8lDZdisSQbv_kKOf3ksw-rnXlVaWUZLo",
    authDomain: "metamp-9dc74.firebaseapp.com",
    databaseURL: "https://metamp-9dc74-default-rtdb.firebaseio.com",
    projectId: "metamp-9dc74",
    storageBucket: "metamp-9dc74.appspot.com",
    messagingSenderId: "533076904532",
    appId: "1:533076904532:web:e824855d9e05e9a7453bc1",
    measurementId: "G-354WH4VW1X"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db };
