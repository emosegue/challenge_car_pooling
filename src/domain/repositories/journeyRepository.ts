export interface JourneyRepository {
    getItemById<T>(id: string, collectionName: string): Promise<T | null>
    getItemByField<T>(field: string, value: any, collectionName: string): Promise<T | null>
    removeItemById<T>(id: string, collectionName: string): Promise<void>
    removeAllItems(collectionName: string): Promise<void>
    insertItem<T>(data: T, collectionName: string): Promise<void>
    insertBulkItems<T>(items: T[], collectionName: string): Promise<void>
}