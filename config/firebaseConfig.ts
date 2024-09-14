import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyAnnURr2STPWHynXYxB3V5RZMw9UprAVfA',
    authDomain: 'car-pooling-challenge-e6468.firebaseapp.com',
    projectId: 'car-pooling-challenge-e6468',
    storageBucket: 'car-pooling-challenge-e6468.appspot.com',
    messagingSenderId: '72017904946',
    appId: '1:72017904946:web:9921de0db6e0afe4bd832b',
    measurementId: 'G-RKHYB4CSY4'
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

// TODO: improve this authentication
signInWithEmailAndPassword(auth, 'admin@cabify.com', '123456')
    .then((userCredential) => {
        const user = userCredential.user;
        console.log('User authenticated:', user.uid);
    })
    .catch((error) => {
        console.error('Error on authentication:', error);
    });

export { firestore, auth };
