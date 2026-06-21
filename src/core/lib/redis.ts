interface CacheItem<T> {
  data: T;
  expiry: number;
}

class SimpleCache {
  private cache = new Map<string, CacheItem<unknown>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  del(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired items periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

type GlobalWithCache = typeof globalThis & {
  killSwitchCache?: SimpleCache;
  killSwitchCacheCleanupInterval?: ReturnType<typeof setInterval>;
};

const globalWithCache = globalThis as GlobalWithCache;

export const cache = globalWithCache.killSwitchCache ?? new SimpleCache();
globalWithCache.killSwitchCache = cache;

if (!globalWithCache.killSwitchCacheCleanupInterval) {
  globalWithCache.killSwitchCacheCleanupInterval = setInterval(
    () => cache.cleanup(),
    60000
  );
}
