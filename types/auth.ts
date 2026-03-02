export interface User {
  id: number;
  username: string;
  email?: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user?: User; // Opcional, dependiendo de si tu backend lo envía
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refresh: string | null;
  isLoading: boolean;
  login: (
    token: string,
    refresh: string,
    userData: User | null,
    isLoading: boolean,
  ) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}
