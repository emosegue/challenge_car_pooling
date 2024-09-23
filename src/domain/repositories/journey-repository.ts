export interface JourneyRepository {
    testConnection(collectionName: string): Promise<void>;
    getItemByField<T>(field: string, value: any, collectionName: string): Promise<T | null>
    getItemsByCondition<T>(field: string, value: any, collectionName: string, orderByField: string): Promise<T[]>
    removeItemByField(field: string, value: any, collectionName: string): Promise<void>
    removeAllItems(collectionName: string): Promise<void>
    insertItem<T>(item: T, collectionName: string): Promise<void>
    insertBulkItems<T>(items: T[], collectionName: string): Promise<void>
    updateFieldItemById<T>(collectionName: string, id: number, fieldName: string, value: any): Promise<void>
}