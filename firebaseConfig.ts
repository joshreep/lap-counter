// Import the functions you need from the SDKs you need
import { FirebaseOptions, initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyDZkOJAv-tplRzv3EQ0MPMw8BtnQiq4wms',
  authDomain: 'lap-counter-dae7a.firebaseapp.com',
  projectId: 'lap-counter-dae7a',
  storageBucket: 'lap-counter-dae7a.appspot.com',
  messagingSenderId: '60886487556',
  appId: '1:60886487556:web:2691a34b379bb2bcffdb51',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export default app
