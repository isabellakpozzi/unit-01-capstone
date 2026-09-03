import api, { extractErrorMessage } from "./api";
import type { AuthUser, Credentials } from "../types";

interface DecodedToken {
  user: AuthUser;
  iat: number;
  exp: number;
}

function decodeToken(token: string): DecodedToken | null {
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payloadJson) as DecodedToken;
  } catch {
    return null;
  }
}

function isTokenExpired(decoded: DecodedToken | null): boolean {
  if (!decoded?.exp) return true;
  return decoded.exp * 1000 < Date.now();
}

export async function signup({ email, password }: Credentials): Promise<AuthUser | null> {
  try {
    const res = await api.post<{ token: string }>("/api/users/signup", { email, password });
    return storeAndDecode(res.data.token);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function login({ email, password }: Credentials): Promise<AuthUser | null> {
  try {
    const res = await api.post<{ token: string }>("/api/users/login", { email, password });
    return storeAndDecode(res.data.token);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export function logout(): void {
  localStorage.removeItem("token");
}

export function getStoredUser(): AuthUser | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded || isTokenExpired(decoded)) {
    localStorage.removeItem("token");
    return null;
  }

  return decoded.user;
}

function storeAndDecode(token: string): AuthUser | null {
  localStorage.setItem("token", token);
  const decoded = decodeToken(token);
  return decoded?.user ?? null;
}