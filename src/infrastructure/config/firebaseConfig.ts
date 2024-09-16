import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
    apiKey: process.env.API,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGEING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

/**
 * This auth solution is not the end game of a correct one, for the purposes of the challenge I consider it sufficient.
 * In a real use case I would use some secrets service to store this type of information.
 */
signInWithEmailAndPassword(auth, process.env.AUTH_USER, process.env.AUTH_PASSWORD)
    .then((userCredential) => {
        const user = userCredential.user;
        console.log('User authenticated:', user.uid);
    })
    .catch((error) => {
        console.error('Error on authentication:', error);
    });

export { firestore, auth };
