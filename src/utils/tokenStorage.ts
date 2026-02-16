type Tokens = { accessToken?: string; refreshToken?: string };

const ACCESS_KEY = 'dms.accessToken';
const REFRESH_KEY = 'dms.refreshToken';

let memoryTokens: Tokens = {};

export const tokenStorage = {
  getAccessToken(): string | undefined {
    try {
      return localStorage.getItem(ACCESS_KEY) || memoryTokens.accessToken;
    } catch {
      return memoryTokens.accessToken;
    }
  },
  getRefreshToken(): string | undefined {
    try {
      return localStorage.getItem(REFRESH_KEY) || memoryTokens.refreshToken;
    } catch {
      return memoryTokens.refreshToken;
    }
  },
  setTokens({ accessToken, refreshToken }: Tokens) {
    try {
      if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
      if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
    } catch {
      memoryTokens = { accessToken, refreshToken };
    }
  },
  clear() {
    try {
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
    } catch {
      // ignore
    }
    memoryTokens = {};
    authEvents.emit('logout');
  }
};

type AuthEvent = 'login' | 'logout' | 'refresh';
type Listener = () => void;

class EventBus {
  private listeners: Record<AuthEvent, Set<Listener>> = {
    login: new Set(),
    logout: new Set(),
    refresh: new Set()
  };
  on(evt: AuthEvent, cb: Listener) {
    this.listeners[evt].add(cb);
    return () => this.listeners[evt].delete(cb);
  }
  emit(evt: AuthEvent) {
    this.listeners[evt].forEach(cb => cb());
  }
}

export const authEvents = new EventBus();

