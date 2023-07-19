// import firebase from 'firebase/compat/app'
// import 'firebase/compat/firestore'; 
// import 'firebase/compat/auth'; 
// import 'firebase/compat/storage';
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, serverTimestamp } from 'firebase/firestore'
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyADHtHS_dQocrVUR08u3dU6DzFDxHr2aig",
    authDomain: "thepromansite.firebaseapp.com",
    projectId: "thepromansite",
    storageBucket: "thepromansite.appspot.com",
    messagingSenderId: "386058339344",
    appId: "1:386058339344:web:7bc655b27c6acd5c487695"
};

//init firebase
// firebase.initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig);

//initializing services
// now this object(projectfirestore) will be used to interact with the firestore database
// const projectFirestore = firebase.firestore();
// This object will be used to authenticate user with firebase.
// const projectAuth = firebase.auth();
// This object will be used to store the data in the firebase storage
// const projectStorage = firebase.storage();

const projectAuth = getAuth(app);
const projectFirestore = getFirestore(app);
const projectStorage = getStorage(app);

//timestamp
const timestamp = serverTimestamp()

export { projectFirestore, projectAuth, timestamp, projectStorage }