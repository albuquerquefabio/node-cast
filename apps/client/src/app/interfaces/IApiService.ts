import { ReactNode } from 'react';

export interface ApiProviderProps {
  children: ReactNode;
}

export interface IApiService {
  login(username: string, password: string): Promise<{ access_token: string }>;
  getUserData<T>(): Promise<T>;
}
