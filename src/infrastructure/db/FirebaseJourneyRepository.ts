import { firestore, auth } from '@firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc, query, where } from 'firebase/firestore';
import { User, onAuthStateChanged } from 'firebase/auth';

export async function getItemById<T>(id: string, collectionName: string): Promise<T | null> {
    try {
        const docRef = doc(firestore, collectionName, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as T;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching document:', error);
        throw error;
    }
}

export async function getItemByField<T>(field: string, value: any, collectionName: string): Promise<T | null> {
    try {
        const q = query(collection(firestore, collectionName), where(field, '==', value));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            return docSnap.data() as T;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching document:', error);
        throw error;
    }
}

export async function removeItemById(collectionName: string, itemId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        onAuthStateChanged(auth, async (user: User | null) => {
            if (user) {
                try {
                    const docRef = doc(firestore, collectionName, itemId);
                    await deleteDoc(docRef);
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

export async function removeAllItems(collectionName: string): Promise<void> {
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

export async function insertItem<T>(data: T, collectionName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        onAuthStateChanged(auth, async (user: User | null) => {
            if (user) {
                try {
                    await addDoc(collection(firestore, collectionName), data);
                    console.log('Item successfully added');
                    resolve();
                } catch (error) {
                    console.error('Error on adding item:', error);
                    reject(error);
                }
            } else {
                reject(new Error('Not authenticated user'));
            }
        });
    });
}
