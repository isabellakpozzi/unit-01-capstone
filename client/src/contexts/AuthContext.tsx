import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import * as authService from "../services/authService";
import type { AuthUser, Credentials } from "../types";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean; 
}

type AuthAction =
  | { type: "SET_USER"; payload: AuthUser | null }
  | { type: "LOGOUT" };

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: Credentials) => Promise<AuthUser | null>;
  signup: (credentials: Credentials) => Promise<AuthUser | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const initialState: AuthState = {
  user: null,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, isLoading: false };
    case "LOGOUT":
      return { ...state, user: null, isLoading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    dispatch({ type: "SET_USER", payload: storedUser });
  }, []);

  async function login(credentials: Credentials) {
    const user = await authService.login(credentials);
    dispatch({ type: "SET_USER", payload: user });
    return user;
  }

  async function signup(credentials: Credentials) {
    const user = await authService.signup(credentials);
    dispatch({ type: "SET_USER", payload: user });
    return user;
  }

  function logout() {
    authService.logout();
    dispatch({ type: "LOGOUT" });
  }

  const value: AuthContextValue = {
    user: state.user,
    isAuthenticated: !!state.user,
    isLoading: state.isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}