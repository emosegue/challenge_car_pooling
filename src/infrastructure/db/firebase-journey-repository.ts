import { firestore, auth } from '@firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc, query, where, limit, orderBy, updateDoc } from 'firebase/firestore';
import { User, onAuthStateChanged } from 'firebase/auth';
import { JourneyRepository } from '../../domain/repositories/journey-repository';
import { ItemNotFoundError } from '@exceptions';
import { CacheService, LoggerService } from '@services';

export class FirebaseJourneyRepository implements JourneyRepository {
    private logger = LoggerService.getInstance();
    public cacheService: CacheService<any>;

    constructor(cacheService?: CacheService<any>) {
        if (cacheService) {
            this.cacheService = cacheService;
            this.initializeCache();
        }
    }

    private async getAllItemsFromCollection(collectionName: string) {
        const q = query(collection(firestore, collectionName));
        const querySnapshot = await getDocs(q);

        const items: any[] = [];
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
        });

        return items;
    }

    private async initializeCache() {
        const cars = await this.getAllItemsFromCollection('cars');
        const groups = await this.getAllItemsFromCollection('groups');
        const journeys = await this.getAllItemsFromCollection('journeys');
        this.cacheService.set('cars', cars);
        this.cacheService.set('groups', groups);
        this.cacheService.set('journeys', journeys);
    }

    async testConnection(collectionName: string): Promise<void> {
        try {
            const q = query(collection(firestore, collectionName), limit(1));
            await getDocs(q);
        } catch (error) {
            throw new Error('Database connection failed');
        }
    }

    async getItemByField<T>(field: string, value: any, collectionName: string): Promise<T | null> {
        const logger = LoggerService.getInstance();
        try {
            const cacheData = this.cacheService.get(collectionName) as T[];
            const cachedItem = cacheData?.find((item) => (item as any)[field] === value);
            if (cachedItem) {
                return cachedItem;
            }

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
            const cacheData = this.cacheService.get(collectionName) as any[];

            if (cacheData) {
                const availableElement = cacheData.filter(element => element[field] === value);
                availableElement.sort((a, b) => a[orderByField] - b[orderByField]);

                return availableElement;
            }

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
                console.log('items sorted', items);
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

        const cacheData = this.cacheService.get(collectionName) as any[];

        if (cacheData) {
            const updatedCacheData = cacheData.filter((item) => (item as any)[field] !== value);
            this.cacheService.set(collectionName, updatedCacheData);
            //console.log('removed', collectionName, this.cacheService.get(collectionName));
        }

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

                        this.cacheService.clear(collectionName);
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
                        this.cacheService.set(collectionName, [...this.cacheService.get(collectionName) ?? [], ...items ?? []]);
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
                    this.logger.error('Not authenticated user');
                    reject(new Error('Not authenticated user'));
                }
            });
        });
    }

    async insertItem<T>(item: T, collectionName: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            onAuthStateChanged(auth, async (user: User | null) => {
                if (user) {
                    try {
                        this.cacheService.set(collectionName, [...this.cacheService.get(collectionName) ?? [], item])
                        //console.log(collectionName, this.cacheService.get(collectionName));
                        await addDoc(collection(firestore, collectionName), item);
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
                        const cacheData = this.cacheService.get(collectionName) as T[];
                        let cachedItem = cacheData?.find((item) => (item as any)['id'] === id);
                        if (cachedItem) {
                            (cachedItem as any)[fieldName] = value;
                            this.cacheService.set(collectionName, cacheData);
                        }

                        const colRef = collection(firestore, collectionName);
                        const q = query(colRef, where('id', '==', id));
                        const querySnapshot = await getDocs(q);

                        if (!querySnapshot.empty) {
                            const docSnap = querySnapshot.docs[0];
                            const docRef = doc(firestore, collectionName, docSnap.id);

                            await updateDoc(docRef, {
                                [fieldName]: value
                            });
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
