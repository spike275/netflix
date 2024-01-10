import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDtq_HPY4pzsBv9lwdVQZCffvU6zgIKeG8",
    authDomain: "netflix-clone-f532b.firebaseapp.com",
    projectId: "netflix-clone-f532b",
    storageBucket: "netflix-clone-f532b.appspot.com",
    messagingSenderId: "345895585848",
    appId: "1:345895585848:web:5a99ba2ef6afb4056dfecd"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore(); //this db is gonna help us keep track of the user subscription
  const auth = firebase.auth();

  export {auth}; //explicit export
  export default db; //default export