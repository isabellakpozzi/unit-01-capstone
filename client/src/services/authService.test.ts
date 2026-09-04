import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "./api";
import { signup, login, logout, getStoredUser } from "./authService";
import type { AuthUser } from "../types";

// Mock the axios instance entirely - these are unit tests for authService's
// own logic (token storage, decoding, error handling), not integration
// tests against a real backend.
vi.mock("./api", () => ({
  default: {
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: { request: { use: vi.fn() } },
  },
  extractErrorMessage: (error: unknown) =>
    error instanceof Error ? error.message : "mock error",
}));

const mockedApi = vi.mocked(api);

// Builds a fake (unsigned, but structurally valid) JWT so decodeToken()
// has something real to parse. The signature is never verified client-side.
function makeToken(user: AuthUser, expiresInSeconds = 3600): string {
  const header = btoa(JSON.stringify({ alg: "none" }));
  const payload = btoa(
    JSON.stringify({
      user,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    }),
  );
  return `${header}.${payload}.signature`;
}

const testUser: AuthUser = { _id: "abc123", email: "test@example.com" };

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("signup", () => {
  it("stores the returned token and returns the decoded user", async () => {
    const token = makeToken(testUser);
    mockedApi.post.mockResolvedValueOnce({ data: { token } });

    const result = await signup({ email: testUser.email, password: "password123" });

    expect(mockedApi.post).toHaveBeenCalledWith("/api/users/signup", {
      email: testUser.email,
      password: "password123",
    });
    expect(result).toEqual(testUser);
    expect(localStorage.getItem("token")).toBe(token);
  });

  it("throws a readable error when signup fails (e.g. duplicate email)", async () => {
    mockedApi.post.mockRejectedValueOnce(new Error("That email is already in use."));

    await expect(
      signup({ email: testUser.email, password: "password123" }),
    ).rejects.toThrow("That email is already in use.");
    expect(localStorage.getItem("token")).toBeNull();
  });
});

describe("login", () => {
  it("stores the returned token and returns the decoded user", async () => {
    const token = makeToken(testUser);
    mockedApi.post.mockResolvedValueOnce({ data: { token } });

    const result = await login({ email: testUser.email, password: "password123" });

    expect(mockedApi.post).toHaveBeenCalledWith("/api/users/login", {
      email: testUser.email,
      password: "password123",
    });
    expect(result).toEqual(testUser);
  });

  it("throws a readable error on bad credentials", async () => {
    mockedApi.post.mockRejectedValueOnce(new Error("bad credentials"));

    await expect(
      login({ email: testUser.email, password: "wrong" }),
    ).rejects.toThrow("bad credentials");
  });
});

describe("logout", () => {
  it("removes the token from localStorage", () => {
    localStorage.setItem("token", makeToken(testUser));
    logout();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("does nothing harmful when there was no token to begin with", () => {
    expect(() => logout()).not.toThrow();
    expect(localStorage.getItem("token")).toBeNull();
  });
});

describe("getStoredUser", () => {
  it("returns null when there is no token", () => {
    expect(getStoredUser()).toBeNull();
  });

  it("returns the decoded user for a valid, unexpired token", () => {
    localStorage.setItem("token", makeToken(testUser));
    expect(getStoredUser()).toEqual(testUser);
  });

  it("returns null and clears storage for an expired token", () => {
    localStorage.setItem("token", makeToken(testUser, -10)); // already expired
    expect(getStoredUser()).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("returns null for a malformed token instead of throwing", () => {
    localStorage.setItem("token", "not-a-real-jwt");
    expect(() => getStoredUser()).not.toThrow();
    expect(getStoredUser()).toBeNull();
  });
});