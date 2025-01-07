export class LocalStorageAdapter<T> {
  constructor(private key: string) {}

  save(data: T): void {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(this.key, serialized);
    } catch (e) {
      console.error("Failed to save to local storage:", e);
    }
  }

  load(): T | null {
    try {
      const serialized = localStorage.getItem(this.key);
      return serialized ? (JSON.parse(serialized) as T) : null;
    } catch (e) {
      console.error("Failed to load from local storage:", e);
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }
}
