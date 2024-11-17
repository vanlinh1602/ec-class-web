// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC7ygXfuEFNKgvGZCNqRGkOjOTYQo4vX_o',
  authDomain: 'english-center-71289.firebaseapp.com',
  projectId: 'english-center-71289',
  storageBucket: 'english-center-71289.firebasestorage.app',
  messagingSenderId: '13574117720',
  appId: '1:13574117720:web:a38419a96f57bf8e77ed2d',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
