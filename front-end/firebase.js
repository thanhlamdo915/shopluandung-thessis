// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {firebase} from '@react-native-firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCAzJO7oqkRLsm3huwVnzxXN3u_5oyBO2s',
  authDomain: 'shopluandung-3dde3.firebaseapp.com',
  projectId: 'shopluandung-3dde3',
  storageBucket: 'shopluandung-3dde3.appspot.com',
  messagingSenderId: '183058149862',
  appId: '1:183058149862:web:55e756b26dbe6db67a2627',
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export {firebase};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
