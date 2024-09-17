import { firestore, auth } from '@firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc, query, where, limit, orderBy, updateDoc } from 'firebase/firestore';
import { User, onAuthStateChanged } from 'firebase/auth';
import { JourneyRepository } from '../../domain/repositories/journey-repository';
import { ItemNotFoundError } from '@exceptions';
import { LoggerService } from '@services';

export class FirebaseJourneyRepository implements JourneyRepository {
    private logger = LoggerService.getInstance();

    async testConnection(collectionName: string): Promise<void> {
        try {
            const q = query(collection(firestore, collectionName), limit(1));
            await getDocs(q);
        } catch (error) {
            throw new Error('Database connection failed');
        }
    }

    async getItemById<T>(id: string, collectionName: string): Promise<T | null> {
        try {
            const docRef = doc(firestore, collectionName, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data() as T;
            } else {
                return null;
            }
        } catch (error) {
            this.logger.error('Error fetching document', error)
            throw error;
        }
    }

    async getItemByField<T>(field: string, value: any, collectionName: string): Promise<T | null> {
        const logger = LoggerService.getInstance();
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
            logger.error('Error fetching document:', error)
            throw error;
        }
    }

    async getItemsByCondition<T>(field: string, value: any, collectionName: string, orderByField: string): Promise<T[]> {
        const logger = LoggerService.getInstance();
        try {
            const collectionRef = collection(firestore, collectionName);
            const q = query(
                collectionRef,
                where(field, '==', value),
                orderBy(orderByField)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const items: T[] = [];
                querySnapshot.forEach(doc => {
                    items.push(doc.data() as T);
                });
                return items;
            } else {
                return [];
            }
        } catch (error) {
            logger.error('Error fetching documents:', error);
            throw error;
        }
    }

    async removeItemByField(field: string, value: any, collectionName: string): Promise<void> {
        const q = query(collection(firestore, collectionName), where(field, '==', value));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const deletePromises = querySnapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
            await Promise.all(deletePromises);
        } else {
            this.logger.error(`No items found with ${field} = ${value}`);
            throw new ItemNotFoundError(`No items found with ${field} = ${value}`)
        }
    }

    async removeAllItems(collectionName: string): Promise<void> {
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
                    this.logger.error('Not authenticated user');
                    reject(new Error('Not authenticated user'));
                }
            });
        });
    }

    async insertBulkItems<T>(items: T[], collectionName: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            onAuthStateChanged(auth, async (user: User | null) => {
                if (user) {
                    try {
                        const collectionRef = collection(firestore, collectionName);
                        const insertPromises = items.map(item =>
                            addDoc(collectionRef, item)
                        );

                        await Promise.all(insertPromises);
                        this.logger.info('Items successfully added');

                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    this.logger.error('Not authenticated user');
                    reject(new Error('Not authenticated user'));
                }
            });
        });
    }

    async insertItem<T>(data: T, collectionName: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            onAuthStateChanged(auth, async (user: User | null) => {
                if (user) {
                    try {
                        await addDoc(collection(firestore, collectionName), data);
                        this.logger.info('Item successfully added');
                        resolve();
                    } catch (error) {
                        this.logger.error('Error on adding item:', error);
                        reject(error);
                    }
                } else {
                    this.logger.error('Not authenticated user');
                    reject(new Error('Not authenticated user'));
                }
            });
        });
    }

    async updateFieldItemById<T>(collectionName: string, id: number, fieldName: string, value: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            onAuthStateChanged(auth, async (user: User | null) => {
                if (user) {
                    try {
                        const colRef = collection(firestore, collectionName);
                        const q = query(colRef, where('id', '==', id));
                        const querySnapshot = await getDocs(q);

                        if (!querySnapshot.empty) {
                            const docSnap = querySnapshot.docs[0];
                            const docRef = doc(firestore, collectionName, docSnap.id);

                            await updateDoc(docRef, {
                                [fieldName]: value
                            });
                            this.logger.info('Item successfully updated');
                            resolve();
                        } else {
                            this.logger.error('No document found with the specified id');
                            reject(new Error('No document found with the specified id'));
                        }
                    } catch (error) {
                        this.logger.error('Error updating item:', error);
                        reject(error);
                    }
                } else {
                    this.logger.error('Not authenticated user');
                    reject(new Error('Not authenticated user'));
                }
            });
        });
    }
}
