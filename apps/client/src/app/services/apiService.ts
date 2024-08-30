import { API_BASE_URL } from '../contants/variables';
import { IApiService } from '../interfaces/IApiService';
import axios from 'axios';

export class ApiService implements IApiService {
  async login(username: string, password: string) {
    const { status, data } = await axios.post<{ access_token: string }>(
      `${API_BASE_URL}/v1/api/auth/login`,
      {
        username,
        password,
      }
    );
    if (status !== 200) throw new Error('Login Failed');
    localStorage.setItem('authToken', data.access_token);
    return data;
  }
}
