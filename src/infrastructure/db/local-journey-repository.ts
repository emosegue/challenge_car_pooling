import { JourneyRepository } from '../../domain/repositories/journey-repository';
import { ItemNotFoundError } from '@exceptions';
import { CacheService, LoggerService } from '@services';

export class LocalJourneyRepository implements JourneyRepository {
    private logger = LoggerService.getInstance();
    public cacheService: CacheService<any>;

    constructor(cacheService?: CacheService<any>) {
        if (cacheService) {
            this.cacheService = cacheService;
            this.initializeCache();
        }
    }

    private async initializeCache() {
        this.cacheService.set('cars', []);
        this.cacheService.set('groups', []);
        this.cacheService.set('journeys', []);
    }

    async testConnection(collectionName: string): Promise<void> {
        try {
            return new Promise((resolve) => {
                console.log('Connection tested', collectionName);
                resolve();
            });
        } catch (error) {
            throw new Error('Database connection failed');
        }
    }

    async getItemByField<T>(field: string, value: any, collectionName: string): Promise<T | null> {
        const logger = LoggerService.getInstance();
        return new Promise<T | null>(async (resolve, reject) => {
            try {
                const cacheData = this.cacheService.get(collectionName) as T[];
                const cachedItem = cacheData?.find((item) => (item as any)[field] === value);
                if (cachedItem) {
                    return resolve(cachedItem);
                }

                return resolve(null);
            } catch (error) {
                logger.error('Error fetching document:', error);
                return reject(error);
            }
        });
    }

    async getItemsByCondition(field: string, value: any, collectionName: string, orderByField: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            try {
                const cacheData = this.cacheService.get(collectionName) as any[];

                if (cacheData) {
                    const availableElement = cacheData.filter(element => element[field] === value);
                    availableElement.sort((a, b) => a[orderByField] - b[orderByField]);

                    resolve(availableElement);
                } else {
                    resolve([]);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    async removeItemByField(field: string, value: any, collectionName: string): Promise<void> {
        const logger = LoggerService.getInstance();

        return new Promise<void>(async (resolve, reject) => {
            try {
                const cacheData = this.cacheService.get(collectionName) as any[];

                if (cacheData) {
                    const updatedCacheData = cacheData.filter((item) => (item as any)[field] !== value);
                    this.cacheService.set(collectionName, updatedCacheData);
                    resolve();
                } else {
                    logger.error(`No items found with ${field} = ${value}`);
                    reject(new ItemNotFoundError(`No items found with ${field} = ${value}`));
                }
            } catch (error) {
                logger.error('Error removing item:', error);
                reject(error);
            }
        });
    }

    async removeAllItems(collectionName: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this.cacheService.clear(collectionName);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    async insertBulkItems<T>(items: T[], collectionName: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const allItems = [...this.cacheService.get(collectionName) ?? [], ...items ?? []];
                this.cacheService.set(collectionName, allItems);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    async insertItem<T>(item: T, collectionName: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this.cacheService.set(collectionName, [...this.cacheService.get(collectionName) ?? [], item])
                resolve();
            } catch (error) {
                this.logger.error('Error on adding item:', error);
                reject(error);
            }
        });
    }

    async updateFieldItemById<T>(collectionName: string, id: number, fieldName: string, value: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const cacheData = this.cacheService.get(collectionName) as T[];
                let cachedItem = cacheData?.find((item) => (item as any)['id'] === id);
                if (cachedItem) {
                    (cachedItem as any)[fieldName] = value;
                    this.cacheService.set(collectionName, cacheData);
                    resolve();
                } else {
                    this.logger.error('No document found with the specified id');
                    reject(new Error('No document found with the specified id'));
                }
            } catch (error) {
                this.logger.error('Error updating item:', error);
                reject(error);
            }
        });
    }
}
