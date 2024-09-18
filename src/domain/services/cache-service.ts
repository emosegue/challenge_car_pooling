export class CacheService<T> {
    private cache: Record<string, T> = {};

    get(key: string): T | undefined {
        return this.cache[key];
    }

    set(key: string, value: T): void {
        this.cache[key] = value;
    }

    clear(key: string): void {
        delete this.cache[key];
    }

    clearAll(): void {
        this.cache = {};
    }
}