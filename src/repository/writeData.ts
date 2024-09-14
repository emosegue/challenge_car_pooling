import { firestore, auth } from '../../config/firebaseConfig'
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { User, onAuthStateChanged } from 'firebase/auth';
import { CarData } from '@models';

export async function addCar(carData: CarData) {
    return new Promise<void>((resolve, reject) => {
        onAuthStateChanged(auth, async (user: User | null) => {
            if (user) {
                try {
                    await addDoc(collection(firestore, 'cars'), carData);
                    console.log('Coche añadido con éxito');
                    resolve();
                } catch (error) {
                    console.error('Error al añadir coche:', error);
                    reject(error);
                }
            } else {
                console.log('Usuario no autenticado');
                reject(new Error('Usuario no autenticado'));
            }
        });
    });
}

export async function emptyCollection(collectionName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        onAuthStateChanged(auth, async (user: User | null) => {
            if (user) {
                try {
                    const collectionRef = collection(firestore, collectionName);
                    const snapshot = await getDocs(collectionRef);

                    const deletePromises = snapshot.docs.map((docSnapshot) =>
                        deleteDoc(doc(firestore, collectionName, docSnapshot.id))
                    );

                    await Promise.all(deletePromises);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            } else {
                reject(new Error('Not authenticated user'));
            }
        });
    });
}

export async function insertBulkItems<T>(items: T[], collectionName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        onAuthStateChanged(auth, async (user: User | null) => {
            if (user) {
                try {
                    const collectionRef = collection(firestore, collectionName);
                    const insertPromises = items.map(item =>
                        addDoc(collectionRef, item)
                    );

                    await Promise.all(insertPromises);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            } else {
                reject(new Error('Not authenticated user'));
            }
        });
    });
}