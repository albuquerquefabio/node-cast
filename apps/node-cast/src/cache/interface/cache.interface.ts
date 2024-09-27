export interface ICacheService {
  createData<T>(key: string, value: T, ttlInSeconds?: number): Promise<void>;
  readData<T>(key: string): Promise<T>;
  readDataByPattern<T>(pattern: string): Promise<Array<T>>;
  updateData<T>(key: string, value: T, ttlInSeconds?: number): Promise<void>;
  deleteData(key: string): Promise<void>;
}
