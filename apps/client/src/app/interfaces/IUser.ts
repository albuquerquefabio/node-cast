export interface User {
  id: string | number;
  name: string;
  username: string;
  email: string;
  role: Array<string>;
  status: boolean;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
}
