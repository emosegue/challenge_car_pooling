import { CacheService } from '@services';

describe('CacheService', () => {
    let cacheService: CacheService<string>;

    beforeEach(() => {
        cacheService = new CacheService();
    });

    test('should store and retrieve an item', () => {
        cacheService.set('key1', 'value1');
        expect(cacheService.get('key1')).toBe('value1');
    });

    test('should return undefined for a non-existent item', () => {
        expect(cacheService.get('nonExistentKey')).toBeUndefined();
    });

    test('should overwrite an existing item', () => {
        cacheService.set('key1', 'value1');
        cacheService.set('key1', 'value2');
        expect(cacheService.get('key1')).toBe('value2');
    });

    test('should delete an item', () => {
        cacheService.set('key1', 'value1');
        cacheService.set('key2', 'value2');
        cacheService.clear('key1');
        expect(cacheService.get('key1')).toBeUndefined();
        expect(cacheService.isEmpty()).toBeFalsy();
    });

    test('should clear all items', () => {
        cacheService.set('key1', 'value1');
        cacheService.set('key2', 'value2');
        cacheService.clearAll();
        expect(cacheService.isEmpty()).toBeTruthy();
    });
});